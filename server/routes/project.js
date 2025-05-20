const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const router = express.Router();

// @route POST /api/projects
// @desc Create a new project
// @access Private
router.post('/', auth, async (req, res) => {
  const { projectName, taskList } = req.body;

  try {
    const newProject = new Project({
      projectName,
      userId: req.user.id,
      taskList
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route GET /api/projects
// @desc Get all projects for a user
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route GET /api/projects/:id
// @desc Get a specific project by ID
// @access Private
router.get('/:id',auth,async (req,res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (project.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(project);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
})

// @route GET /api/projects/:id/task
// @desc Get subtasks for a specific project
// @access Private
router.get('/:id/task', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    res.json({ taskList: project.taskList });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route PUT /api/projects/:id
// @desc Update project fields
// @access Private
router.put('/:id', auth, async (req, res) => {
  const { taskList, timeWorked, report } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (project.userId.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    if (taskList) project.taskList = taskList;
    if (timeWorked) project.timeWorked = timeWorked;
    if (report) project.report = report;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route DELETE /api/projects/:id
// @desc Delete the project
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (project.userId.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST /api/projects/:id/task
// @desc Add a subtask
// @access Private
router.post('/:id/task', auth, async (req, res) => {
  const { id } = req.params;
  const { taskName } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    project.taskList.push({ title: taskName, done: false });
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route DELETE /api/projects/:id/task/:taskIndex
// @desc Delete a subtask
// @access Private
router.delete('/:id/task/:taskIndex', auth, async (req, res) => {
  const { id, taskIndex } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    project.taskList.splice(taskIndex, 1);
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route PATCH /api/projects/:id/task/:taskIndex
// @desc Toggle subtask status
// @access Private
router.patch('/:id/task/:taskIndex', auth, async (req, res) => {
  const { id, taskIndex } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    project.taskList[taskIndex].done = !project.taskList[taskIndex].done;
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route PUT /api/projects/:id/update-time
// @desc Update time worked on a day
// @access Private
router.put('/:id/update-time', auth, async (req, res) => {
  const { date, timeWorked } = req.body;
  const projectId = req.params.id;

  try {
    const secondsWorked = parseInt(timeWorked) * 60;
    if (isNaN(secondsWorked) || secondsWorked <= 0) {
      return res.status(400).json({ msg: 'Invalid timeWorked value' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (project.userId.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    const dateString = new Date(date).toISOString().split('T')[0];
    const normalizedDate = new Date(dateString);

    const existingEntry = project.timeWorkedPerDay.find(
      (entry) => new Date(entry.date).toISOString().split('T')[0] === dateString
    );

    if (existingEntry) {
      existingEntry.totalSeconds += secondsWorked;
    } else {
      project.timeWorkedPerDay.push({
        date: normalizedDate,
        totalSeconds: secondsWorked
      });
    }

    project.totalTimeWorkedSeconds = (project.totalTimeWorkedSeconds || 0) + secondsWorked;

    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route PUT /:projectId/task/:taskIndex/toggle
// @desc to display and update subtasks
// @access Private
router.put('/:projectId/task/:taskIndex/toggle', auth, async (req, res) => {
  const { projectId, taskIndex } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (project.taskList[taskIndex] === undefined) {
      return res.status(400).json({ msg: 'Task not found' });
    }

    project.taskList[taskIndex].done = !project.taskList[taskIndex].done;
    await project.save();

    res.json({ taskList: project.taskList });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
