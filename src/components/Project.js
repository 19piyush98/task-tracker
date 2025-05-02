import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, List, ListItem, Typography, Box, IconButton, Input, Collapse, Select, Paper, Grid, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Delete, Edit, Check, Add, ExpandMore } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers'; 
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import API from '../components/API'

const MAX_PROJECTS = 4;

const ExpandMoreIcon = styled((props) => {
    const { expand, ...other } = props;
    return <ExpandMore {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' }
];

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
};

const TaskItem = ({
    task,
    projectId,
    editingTaskId,
    editedTaskName,
    setEditedTaskName,
    handleUpdateTask,
    handleDeleteTask,
    handleToggleComplete
}) => {
    const [open, setOpen] = useState(false);
    const [editedStatus, setEditedStatus] = useState(task.status);
    const [editedCreationDate, setEditedCreationDate] = useState(task.creationDate ? new Date(task.creationDate) : null);
    const [editedCompletionDate, setEditedCompletionDate] = useState(task.completionDate ? new Date(task.completionDate) : null);
    const [editingDates, setEditingDates] = useState(false);

    const handleStatusChange = (event) => setEditedStatus(event.target.value);
    const handleCreationDateChange = (date) => setEditedCreationDate(date);
    const handleCompletionDateChange = (date) => setEditedCompletionDate(date);
    const toggleEditingDates = () => setEditingDates(!editingDates);

    const original = {
        title: task.title,
        status: task.status,
        creationDate: task.creationDate ? new Date(task.creationDate).toISOString() : null,
        completionDate: task.completionDate ? new Date(task.completionDate).toISOString() : null,
    };

    const current = {
        title: task.title,
        status: editedStatus,
        creationDate: editedCreationDate ? editedCreationDate.toISOString() : null,
        completionDate: editedCompletionDate ? editedCompletionDate.toISOString() : null,
    };

    const hasChanges =
        original.title !== current.title ||
        original.status !== current.status ||
        original.creationDate !== current.creationDate ||
        original.completionDate !== current.completionDate;

    const handleSaveChanges = () => {
        if (hasChanges) {
            handleUpdateTask(projectId, task._id, {
                title: task.title,
                status: editedStatus,
                creationDate: editedCreationDate,
                completionDate: editedCompletionDate,
            });
        }
    };

    return (
        <>
            <ListItem
                key={task._id}
                sx={{
                    borderBottom: '1px solid #e0e0e0',
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: task.completed ? '#f0fff0' : '#fff',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    <IconButton
                        onClick={() => handleToggleComplete(projectId, task._id)}
                        size="small"
                        sx={{ color: task.completed ? 'green' : 'grey' }}
                    >
                        {task.completed && <Check />}
                    </IconButton>

                    {editingTaskId === task._id ? (
                        <Input
                            value={editedTaskName}
                            onChange={(e) => setEditedTaskName(e.target.value)}
                            sx={{ minWidth: '150px' }}
                        />
                    ) : (
                        <Typography
                            variant="body1"
                            sx={{
                                textDecoration: task.completed ? 'line-through' : 'none',
                                cursor: 'pointer',
                                flex: 1,
                            }}
                            onClick={() => setOpen(!open)}
                        >
                            {task.title}
                        </Typography>
                    )}

                    <ExpandMoreIcon
                        onClick={() => setOpen(!open)}
                        sx={{ cursor: 'pointer' }}
                    />
                </Box>

                <Box>
                    <IconButton
                        onClick={handleSaveChanges}
                        disabled={!hasChanges}
                        sx={{ color: hasChanges ? 'primary.main' : 'grey.500' }}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDeleteTask(projectId, task._id)}
                        sx={{ color: 'error.main' }}
                    >
                        <Delete />
                    </IconButton>
                </Box>
            </ListItem>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <Paper sx={{ mx: 2, mb: 2, p: 3, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                            <Typography variant="body2">{task.description || 'No description'}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                            <Typography variant="body2">{task.status}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                            <Typography variant="body2">{formatDate(task.creationDate || task.createdAt)}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" color="text.secondary">Completion Date</Typography>
                            <Typography variant="body2">{formatDate(task.completionDate || task.completedAt)}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={editedStatus}
                                    onChange={handleStatusChange}
                                    label="Status"
                                >
                                    {statusOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Button onClick={toggleEditingDates}>
                                {editingDates ? 'Hide Dates' : 'Edit Dates'}
                            </Button>
                        </Grid>

                        {editingDates && (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <DatePicker
                                        label="Creation Date"
                                        value={editedCreationDate}
                                        onChange={handleCreationDateChange}
                                        renderInput={(params) => <TextField fullWidth {...params} />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <DatePicker
                                        label="Completion Date"
                                        value={editedCompletionDate}
                                        onChange={handleCompletionDateChange}
                                        renderInput={(params) => <TextField fullWidth {...params} />}
                                    />
                                </Grid>
                            </LocalizationProvider>
                        )}

                        {hasChanges && (
                            <Grid item xs={12}>
                                <Button
                                    onClick={handleSaveChanges}
                                    variant="contained"
                                    color="primary"
                                >
                                    Save Changes
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </Collapse>
        </>
    );
};

const ProjectItem = ({
    project,
    selectedProjectId,
    setSelectedProjectId,
    newTaskName,
    setNewTaskName,
    newTaskDescription,
    setNewTaskDescription,
    handleAddTask,
    editingTaskId,
    editedTaskName,
    setEditedTaskName,
    handleUpdateTask,
    handleDeleteTask,
    handleToggleComplete
}) => {
    const [open, setOpen] = useState(false);

    return (
        <ListItem
            key={project._id}
            sx={{
                borderBottom: '1px solid #e0e0e0',
                paddingY: 1.5,
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    cursor: 'pointer',
                }}
                onClick={() => setOpen(!open)}
            >
                <Typography variant="h6" sx={{ mb: 1 }}>{project.title}</Typography>
                <ExpandMoreIcon expand={open} aria-expanded={open} />
            </Box>

            <Collapse in={open} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                <Box sx={{ width: '100%' }}>
                    <List sx={{ width: '100%', mt: 2 }}>
                        {project.tasks?.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                projectId={project._id}
                                editingTaskId={editingTaskId}
                                editedTaskName={editedTaskName}
                                setEditedTaskName={setEditedTaskName}
                                handleUpdateTask={handleUpdateTask}
                                handleDeleteTask={handleDeleteTask}
                                handleToggleComplete={handleToggleComplete}
                            />
                        ))}
                    </List>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedProjectId(project._id)}
                        sx={{ mt: 2 }}
                    >
                        <Add sx={{ mr: 1 }} /> Add Task
                    </Button>

                    {selectedProjectId === project._id && (
                        <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Task Name"
                                value={newTaskName}
                                onChange={(e) => setNewTaskName(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                label="Task Description"
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                            <Button
                                variant="contained"
                                onClick={() => handleAddTask(project._id)}
                                sx={{ width: '100%', maxWidth: 300 }}
                            >
                                Add Task
                            </Button>
                        </Box>
                    )}
                </Box>
            </Collapse>
        </ListItem>
    );
};

export default function Project() {
    const [projectName, setProjectName] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTaskName, setEditedTaskName] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [fetchProjects, setFetchProjects] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await API.get('/user-projects');
                setProjects(res.data);
            } catch (err) {
                console.error('Failed to fetch projects', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [fetchProjects]);

    const handleCreateProject = async () => {
        if (projects.length >= MAX_PROJECTS || !projectName.trim()) return;
        try {
            const res = await API.post('/project', { title: projectName });
            setFetchProjects(prev=> !prev);
            setProjectName('');
        } catch (err) {
            console.error('Failed to create project', err);
        }
    };

    const handleAddTask = async (projectId) => {
        if (!newTaskName.trim()) return;
        try {
            const res = await API.post(`/task`, {
                projectId: projectId,
                title: newTaskName,
                description: newTaskDescription,
            });
            setProjects((prev) =>
                prev.map((p) =>
                    p._id === projectId ? { ...p, tasks: [...p.tasks, res.data] } : p
                )
            );
            setNewTaskName('');
            setNewTaskDescription('');
            setSelectedProjectId(null);
        } catch (err) {
            console.error('Failed to add task', err);
        }
    };

    const handleUpdateTask = async (projectId, taskId, updatedFields) => {
        try {
            const res = await API.put(`/task/${taskId}`, updatedFields);

            setProjects((prev) =>
                prev.map((p) =>
                    p._id === projectId
                        ? {
                            ...p,
                            tasks: p.tasks.map((t) =>
                                t._id === taskId ? res.data : t
                            ),
                        }
                        : p
                )
            );

            setEditingTaskId(null);
            setEditedTaskName('');
        } catch (err) {
            console.error('Failed to update task', err);
        }
    };


    const handleDeleteTask = async (projectId, taskId) => {
        try {
            await API.delete(`task/${taskId}`);
            setProjects((prev) =>
                prev.map((p) =>
                    p._id === projectId
                        ? { ...p, tasks: p.tasks.filter((t) => t._id !== taskId) }
                        : p
                )
            );
        } catch (err) {
            console.error('Failed to delete task', err);
        }
    };

    const handleToggleComplete = async (projectId, taskId) => {
        const project = projects.find((p) => p._id === projectId);
        const task = project?.tasks.find((t) => t._id === taskId);
        if (!task) return;
        try {
            const res = await API.patch(`/projects/${projectId}/tasks/${taskId}/toggle`);
            setProjects((prev) =>
                prev.map((p) =>
                    p._id === projectId
                        ? {
                            ...p,
                            tasks: p.tasks.map((t) => (t._id === taskId ? res.data : t)),
                        }
                        : p
                )
            );
        } catch (err) {
            console.error('Failed to toggle task completion', err);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container component="main" maxWidth="md">
                <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h4" gutterBottom>
                        My Projects
                    </Typography>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
                        <TextField
                            label="Project Name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            fullWidth
                            variant="outlined"
                            disabled={projects.length >= MAX_PROJECTS}
                        />
                        <Button
                            variant="contained"
                            onClick={handleCreateProject}
                            sx={{ width: '100%', maxWidth: 300 }}
                            disabled={projects.length >= MAX_PROJECTS}
                        >
                            Create Project
                        </Button>
                        {projects.length >= MAX_PROJECTS && (
                            <Typography variant="caption" color="textSecondary">
                                Maximum {MAX_PROJECTS} projects reached.
                            </Typography>
                        )}
                    </Box>

                    <List sx={{ width: '100%' }}>
                        {projects && projects.map((project) => (
                            <ProjectItem
                                key={project._id}
                                project={project}
                                selectedProjectId={selectedProjectId}
                                setSelectedProjectId={setSelectedProjectId}
                                newTaskName={newTaskName}
                                setNewTaskName={setNewTaskName}
                                newTaskDescription={newTaskDescription}
                                setNewTaskDescription={setNewTaskDescription}
                                handleAddTask={handleAddTask}
                                editingTaskId={editingTaskId}
                                editedTaskName={editedTaskName}
                                setEditedTaskName={setEditedTaskName}
                                handleUpdateTask={handleUpdateTask}
                                handleDeleteTask={handleDeleteTask}
                                handleToggleComplete={handleToggleComplete}
                            />
                        ))}
                    </List>
                    {projects.length === 0 && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                            No projects yet. Create one to get started.
                        </Typography>
                    )}
                </Box>
            </Container>
        </LocalizationProvider>
    );
}

