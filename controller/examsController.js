const Exams = require("../models/exams");
const Assignment_levels = require("../models/assignment_levels");
const Assignments = require("../models/assignments");
const Questions = require("../models/questions");
const Options = require("../models/options");
const Group_student = require("../models/group_student");
const Assignments_by_groupstudent = require("../models/assignments_by_groupstudent");
const Assignments_by_group = require("../models/assignments_by_group");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const { group } = require("console");

exports.createExam = async (req, res) => {
    try {
    
        await Assignments_by_group.query().insert({
            group_id: req.params.id,
            assignment_id: req.body.assignment_id,
            // when: req.body.when,
            assignment_type_id: req.body.assignment_type_id
        });
        
        
        const group_student = await Group_student.query().where(
            "group_id",
            req.params.id
        );
    
        const assignment_level = await Assignment_levels.query().where(
            "assignment_id",
            req.body.assignment_id
        );
        for (let i = 0; i < group_student.length; i++) {
            const user_id = await Group_student.query()
                .where("id", group_student[i].id)
                .first();
            const newAssignmentByStudent =
                await Assignments_by_groupstudent.query().insert({
                    group_student_id: group_student[i].id,
                    assignment_id: req.body.assignment_id,
                    assignment_type_id: req.body.assignment_type_id,
                    module_id: req.body.module_id,
                    user_id: user_id.user_id,
                    group_id: req.params.id,
                    status: "not completed",
                });
            for (let j = 0; j < assignment_level.length; j++) {
                let questions = await Questions.query()
                    .where("unit_id", assignment_level[j].unit_id)
                    .andWhere("level_id", assignment_level[j].level_id);
    
                for (let k = 0; k < assignment_level[j].quantity; k++) {
                    if (questions.length === 0) {
                        break;
                    }
    
                    let random = Math.floor(Math.random() * questions.length);
    
                    await Exams.query().insert({
                        question_id: questions[random].id,
                        assignment_id: req.body.assignment_id,
                        group_student_id: group_student[i].id,
                        // when: req.body.when,
                        user_id: user_id.user_id,
                        assignment_by_groupstudent_id: newAssignmentByStudent.id,
                        group_id: req.params.id,
                    });
    
                    questions.splice(random, 1);
                }
            }
        }
        return res.status(200).json({ msg: "zo'rsan" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};


exports.getAllExamsResultsForGroup = async (req, res) => {
    try {
        const results = await Assignments_by_groupstudent.query()
            .where("group_id", req.params.id)
            .andWhere("assignment_id", req.body.assignment_id)
            .join(
                "users",
                "assignments_by_groupstudent.user_id",
                "users.id"
            )
            .select(
                "assignments_by_groupstudent.*",
                "users.name as user_name",
                "users.surname as user_surname"
            );
        return res.status(200).json({ success: true, exams: results });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.getAllExamsByStudentByModule = async (req, res) => {
    try {
        // Check for the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Unauthorized: Missing or invalid token",
                });
        }

        // Extract and verify the token
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const studentId = decodedToken.id;

        // Fetch exams from the database
        const exams = await Assignments_by_groupstudent.query()
            .where("assignments_by_groupstudent.user_id", studentId)
            .andWhere("assignments_by_groupstudent.module_id", req.params.id)
            .andWhere("assignments_by_groupstudent.status", "not completed")
            .join(
                "assignments",
                "assignments_by_groupstudent.assignment_id",
                "assignments.id"
            )
            .join(
                "assignment_types",
                "assignments.assignment_type_id",
                "assignment_types.id"
            )
            .select(
                "assignments_by_groupstudent.id as assignment_by_groupstudent_id",
                "assignments.name as assignment_name",
                "assignment_types.name as assignment_type_name"
            );

        // Return the result
        return res.status(200).json({ success: true, exams });
    } catch (error) {
        console.error("Error in getAllExamsByStudentByModule:", error);
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllExamsByStudentByModuleOnlyCompleted = async (req, res) => {
    try {
        // Check for the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Missing or invalid token",
            });
        }

        // Extract and verify the token
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const studentId = decodedToken.id;

        // Fetch all assignments in the module with the specified type
        const assignments = await Assignments.query()
            .where("assignments.module_id", req.params.id) // Qualify module_id
            .andWhere(
                "assignments.assignment_type_id",
                req.body.assignment_type_id
            )
            .join(
                "assignment_types",
                "assignments.assignment_type_id",
                "assignment_types.id"
            )
            .select(
                "assignments.*",
                "assignment_types.name as assignment_type_name"
            );

        // Fetch completed exams taken by the student
        const completedExams = await Assignments_by_groupstudent.query()
            .where("assignments_by_groupstudent.user_id", studentId)
            .andWhere("assignments_by_groupstudent.module_id", req.params.id) // Qualify module_id
            .andWhere(
                "assignments_by_groupstudent.assignment_type_id",
                req.body.assignment_type_id
            )
            .andWhere("assignments_by_groupstudent.status", "completed")
            .join(
                "assignments",
                "assignments_by_groupstudent.assignment_id",
                "assignments.id"
            )
            .join(
                "assignment_types",
                "assignments.assignment_type_id",
                "assignment_types.id"
            )
            .select(
                "assignments_by_groupstudent.assignment_id",
                "assignments_by_groupstudent.id as assignment_by_groupstudent_id",
                "assignments_by_groupstudent.result", // Include the result column
                "assignments.name as assignment_name",
                "assignment_types.name as assignment_type_name"
            );

        // Map completed exams by assignment ID for quick lookup
        const completedExamsMap = new Map(
            completedExams.map((exam) => [exam.assignment_id, exam])
        );

        // Align all assignments with the student's completed exams
        const result = assignments.map((assignment) => {
            const completedExam = completedExamsMap.get(assignment.id);
            if (completedExam) {
                return {
                    assignment_by_groupstudent_id: completedExam.assignment_by_groupstudent_id,
                    assignment_id: assignment.id,
                    assignment_name: assignment.name,
                    assignment_type_name: completedExam.assignment_type_name,
                    status: "completed",
                    result: completedExam.result, // Include the result in the response
                };
            } else {
                return {
                    assignment_id: assignment.id,
                    assignment_name: assignment.name,
                    assignment_type_name: assignment.assignment_type_name, // Use correct assignment type name
                    status: "not taken yet",
                    result: null, // No result if the assignment is not taken
                };
            }
        });

        // Return the result
        return res.status(200).json({ success: true, exams: result });
    } catch (error) {
        console.error("Error in getAllExamsByStudentByModule:", error);
        return res.status(400).json({ success: false, error: error.message });
    }
};
    


exports.getAllQuestionsByExam = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const studentId = decodedToken.id;
        const questions = await Exams.query()
            .where("user_id", studentId)
            .andWhere(
                "assignment_by_groupstudent_id",
                req.params.id
            )
            .join("questions", "exams.question_id", "questions.id")
            .select("exams.*", "questions.question as question");
        let result = await Promise.all(
            questions.map(async (e) => {
                let ans = await Options.query().where("question_id", e.question_id);
                return { ...e, options: ans };
            })
        );
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.answers = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const studentId = decodedToken.id;
        let countTrue = 0
        const exam = await Assignments_by_groupstudent.query().where('user_id', studentId).andWhere('id', req.body.assignment_by_groupstudent_id).first()
    
        if (exam.status === "not completed") {
            for (let i = 0; i < req.body.answers.length; i++) {
                await Exams.query()
                    .where("user_id", studentId)
                    .andWhere(
                        "assignment_by_groupstudent_id",
                        req.body.assignment_by_groupstudent_id
                    )
                    .andWhere("question_id", req.body.answers[i].question_id)
                    .update({
                        option_id: req.body.answers[i].answer,
                    });
                const trueAnswer = await Options.query()
                    .where("question_id", req.body.answers[i].question_id)
                    .andWhere("isRight", "right")
                    .select("id", "option")
                    .first();
                
                if (req.body.answers[i].answer === trueAnswer.id) {
                    await Exams.query()
                        .where("user_id", studentId)
                        .andWhere(
                            "assignment_by_groupstudent_id",
                            req.body.assignment_by_groupstudent_id
                        )
                        .andWhere("question_id", req.body.answers[i].question_id)
                        .update({
                            isTrue: 1,
                        });
                    countTrue++
                } else {
                    await Exams.query()
                        .where("user_id", studentId)
                        .andWhere(
                            "assignment_by_groupstudent_id",
                            req.body.assignment_by_groupstudent_id
                        )
                        .andWhere("question_id", req.body.answers[i].question_id)
                        .update({
                            isTrue: 0,
                        });
                }
            }
        
    
            const result = countTrue / req.body.answers.length
            await Assignments_by_groupstudent.query()
                .where("user_id", studentId)
                .andWhere(
                    "id", req.body.assignment_by_groupstudent_id).update({
                        result: result,
                        status: "completed"
                    })
        
                    return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ success: false, msg: "Already completed" }); 
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.getAnswers = async (req, res) => {
    try {
        // Extract the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Missing or invalid token",
            });
        }

        // Extract and verify the token
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const studentId = decodedToken.id;

        // Query the database using proper joins to get all options for each question
        const exams = await Exams.query()
            .where("exams.user_id", studentId)
            .andWhere("exams.assignment_by_groupstudent_id", req.params.id)
            .join("options", "exams.question_id", "options.question_id") // Join with options based on question_id
            .join("questions", "exams.question_id", "questions.id") // Join with the questions table
            .select(
                "exams.id as exam_id",
                "exams.assignment_by_groupstudent_id",
                "exams.assignment_id",
                "exams.question_id",
                "exams.option_id as student_option_id", // Option ID from exams table
                "exams.isTrue",
                "exams.created",
                "options.option as answer", // Answer from options table (selected option)
                "questions.question as question", // Question text from questions table
                "options.id as option_id", // Option ID from options table
                "options.option", // All options for the question
                "options.isRight" // Whether this option is the correct one
            )
            .orderBy("options.id"); // Ensure options are ordered for each question

        // Group options for each question to display them together
        const groupedExams = exams.reduce((acc, exam) => {
            const {
                exam_id,
                question,
                option_id,
                student_option_id,
                answer,
                isRight,
                ...rest
            } = exam;

            // Initialize the exam record if not already created
            if (!acc[exam_id]) {
                acc[exam_id] = {
                    ...rest,
                    exam_id,
                    question,
                    options: [],
                    selected_option_id: null, // Initialize selected_option_id as null
                };
            }

            // Add each option to the options array
            acc[exam_id].options.push({
                option_id,
                answer,
                isRight, // Include isRight for each option
            });

            // Set selected_option_id once for each exam using the correct student_option_id
            if (student_option_id && acc[exam_id].selected_option_id === null) {
                // Set selected_option_id to the student_option_id (correct option selected by the student)
                acc[exam_id].selected_option_id = student_option_id; // Use student_option_id
                console.log("Set selected_option_id to:", student_option_id); // Log when we set selected_option_id
            }

            return acc;
        }, {});

        // Convert the grouped exams object back to an array
        const result = Object.values(groupedExams);

        // Return the results
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error in getAnswers:", error);
        return res.status(400).json({ success: false, error: error.message });
    }
};











