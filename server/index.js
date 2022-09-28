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
app.use(cors({
        origin: "http://localhost:3000",
	    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
	    credentials: true
    }
));

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'prankursharma',
    database: 'chatapp'
});

const options = {
    password: "prankursharma",
    user: "root",
    database: "chatapp",
    host: "localhost",
    createDatabaseTable: true
}

const pool = mysql.createPool(options);

const sessionStore = new mysqlStore(options, pool);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//app.set('trust proxy', 1);
app.use(session({
	name: "name",
	secret: "abcd",
	resave: false,
	saveUninitialized: false,
	store: sessionStore,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 365,
		//httpOnly: true,
		//secure: process.env.NODE_ENV == 'production' ? true : false,
        //secure: false,
		//sameSite: 'none'
	}
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
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
    console.log(sender);
    const sqlInsert = "insert into messages (room_no, sender, msg, msg_time) values (?, ?, ?, ?)";
    db.query(sqlInsert, [room, sender, message, time], (err, result) => {
        res.status(200).json({});
    });
});

app.post('/api/signup', (req, res) => {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    const sqlInsert = "insert into users (name, email, password) values (?, ?, ?)";
    db.query(sqlInsert, [username, email, password], (err, result) => {
        res.status(200).json({});
    });
});

app.post('/api/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    const sqlSelect = "select * from users where email = ? and password = ?";
    db.query(sqlSelect, [email, password], (err, result) => {
        if(result.length > 0){
            req.session.user = result;
            res.send(result);
        }
        else{
            res.send({message: "Invalid email or password"});
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

app.post('/api/checkroom', (req, res) => {
    let room = req.body.room;
    let email = req.body.email;
    const sqlSelect = "select * from rooms where room_no = ?";
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
                    res.status(200).json({});
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
    const sqlInsert = "insert into rooms (room_no, email) values (?, ?)";
    db.query(sqlInsert, [room, email], (err, result) => {
        res.status(200).json({});
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
    const sqlSelect = "select room_no from rooms where email = ?";
    db.query(sqlSelect, req.session.user[0].email, (err, result) => {
        res.send(result);
    });
});

server.listen(3001, () => {
    console.log("Server running");
});