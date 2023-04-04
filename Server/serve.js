require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db = require('./Database');
const { auth, Role } = require('./Middelware'); //MIDDLEWARE FUNCTION.
const { generateToken } = require('./ImpFunction');  //IMPORTANT FUNCTION.
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  origin: 'http://localhost:3000',
}));


//SIGNIN REQUEST.
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  generateToken(username, password, (err, { userID, role, token } = {}) => {
    if (err) {
      return res.status(401).json({ message: err });
    }
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Logged in successfully', userID, role });
  });

});

//****************TEACHER ENDPOINT****************

app.get('/dashboard/teacher/:id', auth, Role('teacher'), (req, res) => {
  const userId = req.user.userID;
  const getID = parseInt(req.params.id);
  if (userId === getID) {
    const teacherId = req.user.userID;

    const query = `
SELECT teachers.*, subjects.subject_id, subjects.subject_name
FROM teachers
INNER JOIN subjects ON teachers.teacher_id = subjects.teacher_id
WHERE teachers.teacher_id = ${userId};
`;

    db.query(query, [teacherId], (error, results, fields) => {
      if (error) throw error;

      res.status(200).json(results);
    });
  } else {
    res.status(401).json({ err: 'You are not authorized to access this resource.', userId });

  }
});

//****************TEACHER ENDPOINT****************
//**************GETING SEM DATA FROM TEACHER TABLE.****************
app.get('/dashboard/teacher/:id/students/:subject_id', (req, res) => {
  const teacherId = req.params.id;
  const subjectId = req.params.subject_id;
  // Query the database to get the student data based on the teacher id and semester id
  const sql = `
 SELECT 
  s.student_id, 
  s.student_name, 
  s.roll_no, 
  ROUND(SUM(a.STATUS) / COUNT(a.attendance_id) * 100, 2) AS attendance_percentage, 
  RANK() OVER (ORDER BY ROUND(SUM(a.STATUS) / COUNT(a.attendance_id) * 100, 2) DESC) AS rank
FROM 
  students s
  INNER JOIN subjects sb ON s.dept_id = sb.dept_id
  INNER JOIN teachers t ON sb.teacher_id = t.teacher_id
  INNER JOIN attendance a ON s.student_id = a.student_id AND sb.subject_id = a.subject_id
WHERE 
  t.teacher_id = ? AND 
  sb.subject_id = ? AND 
  a.attendance_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
GROUP BY 
  s.student_id, 
  s.student_name, 
  s.roll_no
ORDER BY 
  attendance_percentage DESC;

  `;
  db.query(sql, [teacherId, subjectId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve student data' });
    } else {
      res.json(results);
    }
  });
});
//************getting data for the bar graph************
app.get('/dashboard/teacher/:id/students/:subject_id/bardata', (req, res) => {
  const teacherId = req.params.id;
  const subjectId = req.params.subject_id;
  // Query the database to get the student data based on the teacher id and semester id
  const sql = `
SELECT
  DATE_FORMAT(attendance.attendance_date, '%W') AS day_name,
  COALESCE(COUNT(CASE WHEN attendance.STATUS = 1 THEN 1 END) * 100 / COUNT(*), 0) AS percentage
FROM
  attendance
  INNER JOIN subjects ON attendance.subject_id = subjects.subject_id
WHERE
  attendance.teacher_id = ? AND
  attendance.subject_id = ? AND
  attendance.attendance_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY
  day_name;

  `;
  db.query(sql, [teacherId, subjectId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve student data' });
    } else {

      res.json(results);
    }
  });
});

//*************GET ATTENDENCE RECORD IN PIE CHART ***************/
app.get('/dashboard/teacher/:id/students/:subjects/piechart', (req, res) => {
  const teacherId = req.params.id;
  const subjectId = req.params.subjects;
  // Query the database to get the student data based on the teacher id and semester id
  const sql = `
SELECT
  s.subject_name,
  DAYNAME(a.attendance_date) AS day_name,
  COUNT(CASE WHEN a.STATUS = 1 THEN 1 END) * 100 / COUNT(*) AS percentage
FROM
  attendance a
  INNER JOIN subjects s ON a.subject_id = s.subject_id
WHERE
  a.teacher_id = ? AND
  a.subject_id = ? AND
  a.attendance_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY
  s.subject_name, DAYNAME(a.attendance_date);

  `;
  db.query(sql, [teacherId, subjectId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve student data' });
    } else {

      res.json(results);

    }
  });
});

//*************GET ATTENDENCE RECORD BY SUBJECT ****************/
app.get('/dashboard/teacher/:id/students/:subjects/subject', (req, res) => {
  const teacherId = req.params.id;
  const subject = req.params.subjects;
  // Query the database to get the student data based on the teacher id and semester id
  const sql = `
SELECT 
  s.student_id, 
  s.student_name, 
  s.roll_no, 
  COUNT(CASE WHEN a.status = 1 THEN 1 END) * 100 / COUNT(*) AS percentage
FROM 
  attendance a
  INNER JOIN students s ON a.student_id = s.student_id
  INNER JOIN subjects sb ON a.subject_id = sb.subject_id
WHERE 
  sb.teacher_id = ? 
  AND a.subject_id = ? 
  AND a.attendance_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY 
  s.student_id, 
  s.student_name, 
  s.roll_no;


  `;
  db.query(sql, [teacherId, subject], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve student data' });
    } else {

      res.json(results);

    }
  });
});

//**************MARKING ATTENDENCE ..****************
// Endpoint to mark attendance
app.post('/dashboard/teacher/:id/mark-attendance', (req, res) => {
  const { markedStudents, Subject } = req.body;
  console.log(Subject);
  const teacherId = req.params.id;
  const subjectId = Subject; // assuming all students belong to the same subject
  const attendanceDate = new Date().toISOString().slice(0, 10); // get current date in YYYY-MM-DD format

  markedStudents.forEach(student => {
    const sql = 'INSERT INTO attendance (teacher_id, subject_id, student_id, attendance_date, status) VALUES (?, ?, ?, ?, ?)';
    const values = [teacherId, subjectId, student.student_id, attendanceDate, student.attendance];
    db.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log(`${result.affectedRows} rows inserted`);
    });
  });

  // Send response
  res.status(200).json({ message: 'Attendance marked successfully' });
});

//***********TODO:FOR DOWNLODING THE DATA FOR DOWNLODING THE DATA FOR DOWNLODING THE DATA***************** */
app.get('/dashboard/teacher/:id/students/:days/download', (req, res) => {
  const teacherId = req.params.id;
  const Days = req.params.days;
  // Query the database to get the student data based on the teacher id and semester id
  const sql = `
SELECT 
  s.student_id, 
  s.student_name,
  COUNT(CASE WHEN a.STATUS = 1 THEN 1 END) * 100 / COUNT(*) AS percentage,
  CASE 
    WHEN COUNT(CASE WHEN a.STATUS = 1 THEN 1 END) * 100 / COUNT(*) < 20 THEN 'Double Trouble'
    WHEN COUNT(CASE WHEN a.STATUS = 1 THEN 1 END) * 100 / COUNT(*) >= 20 AND COUNT(CASE WHEN a.STATUS = 1 THEN 1 END) * 100 / COUNT(*) < 50 THEN 'Single Trouble'
    WHEN COUNT(CASE WHEN a.STATUS = 1 THEN 1 END) * 100 / COUNT(*) >= 50 AND COUNT(CASE WHEN a.STATUS = 1 THEN 1 END) * 100 / COUNT(*) < 70 THEN 'Safe Zone'
    WHEN COUNT(CASE WHEN a.STATUS = 1 THEN 1 END) * 100 / COUNT(*) >= 70 THEN 'Recliner Zone'
  END AS attendance_category
FROM students s
INNER JOIN attendance a ON s.student_id = a.student_id
WHERE a.teacher_id = ? AND a.attendance_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
GROUP BY s.student_id;



  `;
  db.query(sql, [teacherId, Days], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve student data' });
    } else {
      res.json(results);

    }
  });
});

//**********************GET THE CARD DATA***********
app.get('/dashboard/teacher/:id/students/:days/TeacherCard', (req, res) => {
  const teacherId = req.params.id;
  console.log(teacherId);
  // Query the database to get the student data based on the teacher id and semester id
  const sql = `
SELECT COUNT(DISTINCT s.student_id) AS total_students, COUNT(CASE WHEN a.STATUS = 1 THEN 1 END) * 100 / COUNT(*) AS present_percentage, COUNT(CASE WHEN a.STATUS = 0 THEN 1 END) * 100 / COUNT(*) AS absent_percentage FROM attendance a INNER JOIN students s ON a.student_id = s.student_id WHERE a.teacher_id = ? AND a.attendance_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY);



  `;
  db.query(sql, [teacherId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve student data' });
    } else {
      res.json(results);
      console.log(results);
    }
  });
});



//****************STUDENT ENDPOINT****************
app.get('/dashboard/student/:id', auth, Role('student'), (req, res) => {
  const userId = req.user.userID;
  const getID = parseInt(req.params.id);
  if (userId === getID) {
  } else {
    res.status(401).json({ err: 'You are not authorized to access this resource.', userId });

  }
});



app.get('/', (req, res) => {

});







app.listen(port, () => console.log(`listening on port ${port}!`))