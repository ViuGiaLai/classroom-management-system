import api from './axiosConfig';

// Format assignment data from API to frontend format
const formatAssignment = (assignment) => ({
    id: assignment._id,
    title: assignment.title,
    class: assignment.class_id?.name || 'Chưa có lớp',
    classId: assignment.class_id?._id || assignment.class_id,
    dueDate: assignment.due_date,
    totalScore: assignment.max_points,
    status: new Date(assignment.due_date) < new Date() ? 'expired' : 'active',
    submittedCount: assignment.submissions?.length || 0,
    totalStudents: assignment.class_id?.students?.length || 0,
    type: assignment.type || 'essay',
    description: assignment.description,
    questions: assignment.questions || [],
    createdBy: assignment.created_by,
    organization_id: assignment.organization_id
});

// Get all assignments for a class
export const getAssignments = (classId) => {
    return api.get(`/assignments/class/${classId}`)
        .then(response => response.data.map(formatAssignment))
        .catch(error => {
            console.error('Error fetching assignments:', error);
            throw error;
        });
};

// Get a single assignment by ID
export const getAssignmentById = (id) => {
    return api.get(`/assignments/${id}`)
        .then(response => formatAssignment(response.data))
        .catch(error => {
            console.error('Error fetching assignment:', error);
            throw error;
        });
};

// Create a new assignment
export const createAssignment = (assignmentData) => {
    const payload = {
        title: assignmentData.title,
        description: assignmentData.description,
        class_id: assignmentData.classId,
        due_date: assignmentData.dueDate,
        max_points: assignmentData.totalScore,
        type: assignmentData.type,
        questions: assignmentData.questions,
        organization_id: assignmentData.organization_id
    };

    return api.post('/assignments', payload)
        .then(response => response.data)
        .catch(error => {
            console.error('Error creating assignment:', error);
            throw error;
        });
};

export const updateAssignment = (id, assignmentData) => {
    if (!id) {
        console.error('Error: Assignment ID is required');
        throw new Error('ID bài tập không hợp lệ');
    }

    const payload = {
        ...(assignmentData.title && { title: assignmentData.title }),
        ...(assignmentData.description && { description: assignmentData.description }),
        ...(assignmentData.classId && { class_id: assignmentData.classId }),
        ...(assignmentData.dueDate && { due_date: assignmentData.dueDate }),
        ...(assignmentData.totalScore && { max_points: assignmentData.totalScore }),
        ...(assignmentData.type && { type: assignmentData.type }),
        ...(assignmentData.questions && { questions: assignmentData.questions }),
        ...(assignmentData.status && { status: assignmentData.status })
    };

    console.log('Updating assignment:', { id, payload });
    
    return api.put(`/assignments/${id}`, payload)
        .then(response => {
            console.log('Update successful:', response.data);
            return response.data;
        })
        .catch(error => {
            console.error('Error updating assignment:', {
                error,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        });
};

export const deleteAssignment = async (id) => {
    try {
        const response = await api.delete(`/assignments/${id}`);
        return response.data;
    } catch (error) {
        console.error('Delete error:', error);
        throw error;
    }
};

export const getMyAssignments = () => {
    return api.get('/assignments/teacher/my-assignments')
        .then(response => response.data.map(formatAssignment))
        .catch(error => {
            console.error('Error fetching teacher assignments:', error);
            throw error;
        });
};

export const getAssignmentSubmissions = (assignmentId) => {
    return api.get(`/assignments/${assignmentId}/submissions`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching assignment submissions:', error);
            throw error;
        });
};
