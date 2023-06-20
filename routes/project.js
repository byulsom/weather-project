const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const mongoose = require('mongoose');

// Getting all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one project
router.get('/:id', getProject, (req, res) => {
  res.json(res.project);
});

// Getting project by userid
router.get('/user/:userid', getProjectsByUserId, (req, res) => {
  res.json(res.projects);
});



// Create a project
router.post('/', async (req, res) => {
  const { projectname, products, userid } = req.body;

  try {
    const currentDate = new Date();
    const newProject = new Project({
      projectname,
      products,
      userid,
      postedAt: currentDate, // Add the current date and time
    });

    const savedProject = await newProject.save();

    res.json(savedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create new project', details: err.message });
  }
});



// Update a project
router.patch('/userid/:userid', (req, res) => {
  const { active } = req.body;
  const { userid } = req.params;

  Project.findOneAndUpdate({ userId: userid }, { active: active }, { new: true })
    .then((updatedProject) => {
      if (!updatedProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(updatedProject);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to update project', message: err.message });
    });
});




// delete a project
router.delete('/:id', async (req, res) => {
  const projectId = req.params.id;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.active = false; // Set the active field to false to make the project inactive

    const updatedProject = await project.save();

    res.json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update project', details: err.message });
  }
});


 
// Middleware to get a project by ID
async function getProject(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.project = project;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Middleware to get a project by userid
async function getProjectsByUserId(req, res, next) {
  const { userid } = req.params;

  try {
    const projects = await Project.find({ userid: userid }); // Use "userid" instead of "_id"

    if (projects.length === 0) {
      return res.status(404).json({ message: 'Projects not found' });
    }

    res.projects = projects;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}




module.exports = router;
