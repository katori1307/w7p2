require("dotenv").config();
const express = require('express');
const app = express();
const { readFile } = require("fs/promises");
const port = process.env.PORT | 3000;
const attendee_list = [];

app.engine("html", async (path, opt, cb) => {
    const raw = await readFile(path, { encoding: "utf-8" });
    let rendered = raw.replace("{{attendee_list_rendered}}", getAttendeeList());


    return cb(null, rendered);
});

app.use(express.static("./static"));

app.set("views", "./views");
app.set("view engine", "html");

app.get('/', (req, res) => {
    res.render("homepage");
});

app.get("/submit_page", (req, res) => {
    res.render("submit_page");
});

app.get('/addAttendee', (req, res) => {
    let { name, email, isAttending } = req.query;
    console.log("Submitted!");
    console.log(isAttending);
    if (isAttending === undefined) {
        isAttending = "no";
    } else {
        isAttending = "yes";
    }
    attendee_list.push({ name, email, isAttending });
    res.render("submit_page");
});

app.get("/list", (req, res) => {
    console.log(attendee_list);
    res.render("list");
});

function getAttendeeList() {
    let content = ``;
    for (let i = 0; i < attendee_list.length; i++) {
        content += `
            <tr>
                <th scope="row">${i + 1}</th>
                <td>${attendee_list[i].name}</td>
                <td>${attendee_list[i].email}</td>
                <td>${attendee_list[i].isAttending}</td>
            </tr>
        `;
    }
    return content;
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));







