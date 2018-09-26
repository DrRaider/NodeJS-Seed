const express = require("express");
const router = express.Router();
const csv = require('csv');

const jokes = require("./jokes");

const upload_path = './data/csv/jokes';
const file_handler = require('../utils/file_handler');
const FileUploadError = require("../utils/FileError").FileUploadError;
const FileOpenError = require("../utils/FileError").FileOpenError;
const upload = file_handler.upload_csv(upload_path);


router.get("/", async (req, res, next) => {
    try {
        res.send(await jokes.find_all_jokes());
    } catch(err) {
        return next(err);
    }
});

// Return a random joke
router.get("/random", async (req, res, next) => {
    try {
        res.send(await jokes.rdm_joke());
    } catch(err) {
        return next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        res.send(await jokes.get_joke(req.params.id));
    } catch (err) {
        return next(err);
    }
});



router.get("/delete/:id", async (req, res, next) => {
    try {
        res.send(await jokes.del_joke(req.params.id));
    } catch (err) {
        return next(err);
    }
});

// Add a csv with jokes in it
router.post("/csv", upload, async (req, res, next) => {
    if(!req.file)
    {
        return next( new FileUploadError('File missing'));
    }
    let obj = csv();
    let filename = req.file.filename;
    obj.from.path(upload_path + '/' + filename, {
        delimiter: ",",
        escape: '"',
    })
        // when a record is found in the CSV file (a row)
        .on("record", async (row, index) => {
            if (index === 0) {

            } else {
                let question = row[0].trim();
                let answer = row[1].trim();
                await jokes.add_joke(question, answer).catch((err) => {
                    throw err;
                });
            }
        })
        .on("end",async () => {
            await file_handler.delete_file(upload_path, filename).catch((err) => {
                throw err;
            });
            return res.send(true);
        })
        .on("error", () => {
            throw new FileOpenError(upload_path, filename);
        });
});


router.post("/", async (req, res, next) => {
    let question = req.body.question;
    let answer = req.body.answer;
    try {
        res.send(await jokes.add_joke(question, answer));
    } catch(err) {
        return next(err);
    }
});

router.post("/edit/:id", async (req, res, next) => {
    let id = req.params.id;
    let question = req.body.question;
    let answer = req.body.answer;
    let used = req.body.used;

    try {
        res.send(await jokes.edit_joke(id, question, answer, used));
    } catch(err) {
        return next(err);
    }
});

module.exports = router;