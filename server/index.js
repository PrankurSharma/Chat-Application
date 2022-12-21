const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');

const saltRounds = 10;
var port = process.env.PORT || 3001;

app.use(cors({
        origin: "https://mychatly.netlify.app",
	    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
	    credentials: true
    }
));

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const options = {
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    createDatabaseTable: true
}

const pool = mysql.createPool(options);

const sessionStore = new mysqlStore(options, pool);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(session({
	name: process.env.SESS_NAME,
	secret: process.env.SESS_SECRET,
	resave: false,
	saveUninitialized: false,
	store: sessionStore,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 365,
		httpOnly: true,
		secure: process.env.NODE_ENV == 'production' ? true : false,
		sameSite: 'none'
	}
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://mychatly.netlify.app",
        methods: ["GET", "POST"],
        credentials: true
    },
});

io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("join_room", (room_no) => {
        socket.join(room_no);
        console.log(`User with ID: ${socket.id} joined room: ${room_no}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("disconnected", socket.id);
    });
});

app.post('/api/insert', (req, res) => {
    let room = req.body.room_no;
    let sender = req.body.sender;
    let message = req.body.message;
    let time = req.body.time;
    let sender_email = req.body.sender_email;
    const sqlInsert = "insert into messages (room_no, sender, msg, msg_time, sender_email) values (?, ?, ?, ?, ?)";
    db.query(sqlInsert, [room, sender, message, time, sender_email], (err, result) => {
        res.status(200).json({});
    });
});

app.post('/api/signup', (req, res) => {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
            console.log(err);
        }
        else{
            const sqlInsert = "insert into users (name, email, password) values (?, ?, ?)";
            db.query(sqlInsert, [username, email, hash], (err, result) => {
                res.status(200).json({});
            });
        }
    });
});

app.post('/api/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    const sqlSelect = "select * from users where email = ?";
    db.query(sqlSelect, [email, password], (err, result) => {
        if(result.length > 0){
            bcrypt.compare(password, result[0].password, (err, ress) => {
                if(ress){
                    req.session.user = result;
                    res.send(result);
                }
                else{
                    res.send({message: "Wrong id or password."});
                }
            });
        }
        else{
            res.send({message: "User doesn't exist."});
        }
    });
});

app.get('/api/login', (req, res) => {
    if(req.session.user){
        res.send(req.session.user);
    }
    else{
        res.send({message: "Please login in order to continue"});
    }
});

app.get('/api/logout', (req, res) => {
    if(req.session.user) {
        req.session.destroy();
        res.send({message: "Logged out."});
        res.end();
    }
});

app.post('/api/checkroom', (req, res) => {
    let room = req.body.room;
    let email = req.body.email;
    const sqlSelect = "select * from room_details where room = ?";
    db.query(sqlSelect, room, (err, result) => {
        if(result.length > 0){
            const sqlSel = "select * from rooms where room_no = ? and email = ?";
            db.query(sqlSel, [room, email], (err, ress) => {
                if(!ress.length) {
                    const sqlInsert = "insert into rooms (room_no, email) values (?, ?)";
                    db.query(sqlInsert, [room, email], (err, results) => {
                        res.send(result);
                    });
                }
                else{
                    res.send({message: "Already in this group."});
                }
            });
        }
        else{
            res.send({message: "Invalid Room No."});
        }
    });
});

app.post('/api/addmember', (req, res) => {
    let room = req.body.room;
    let email = req.body.email;
    const sqlSelect = "select * from room_details where room = ?";
    db.query(sqlSelect, room, (err, result) => {
        if(result.length > 0){
            const sqlSel = "select * from rooms where room_no = ? and email = ?";
            db.query(sqlSel, [room, req.session.user[0].email], (err, ress) => {
                if(ress.length) {
                    db.query(sqlSel, [room, email], (err, r) => {
                        if(r.length){
                            res.send("The person is already in this group.");
                        }
                        else{
                            const sqlInsert = "insert into rooms (room_no, email) values (?, ?)";
                            db.query(sqlInsert, [room, email], (err, results) => {
                                res.send(result);
                            });
                        }
                    });
                }
                else{
                    res.send({message: "You are not a part of this group. So, person can't be added to this group by you."});
                }
            });
        }
        else{
            res.send({message: "Invalid Room No."});
        }
    });
});

app.post('/api/createroom', (req, res) => {
    let room = req.body.room;
    let email = req.body.email;
    let groupname = req.body.groupname;
    const sqlInsertRoom = "insert into rooms (room_no, email) values (?, ?)";
    db.query(sqlInsertRoom, [room, email], (err, result) => {
        const sqlInsertRoomDetails = "insert into room_details(room, group_name) values (?, ?)";
        db.query(sqlInsertRoomDetails, [room, groupname], (err, result) => {
            res.status(200).json({});
        });
    });
});

app.post('/api/getmessages', (req, res) => {
    let room_no = req.body.room_no;
    const sqlSelect = "select * from messages where room_no = ?";
    db.query(sqlSelect, room_no, (err, result) => {
        res.send(result);
    });
});

app.get('/api/fetchrooms', (req, res) => {
    const sqlSelect = "select r.room_no, rd.group_name from rooms r, room_details rd where r.email = ? and r.room_no = rd.room";
    db.query(sqlSelect, req.session.user[0].email, (err, result) => {
        res.send(result);
    });
});

server.listen(port, () => {
    console.log("Server running");
});