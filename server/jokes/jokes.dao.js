const sqlite = require("../sqlite");
const DuplicateResultError = require("../utils/DatabaseError").DuplicateResultError;
const EmptyResultError = require("../utils/DatabaseError").EmptyResultError;

let get_jokes = async () => {
    return await sqlite.all("SELECT ID, QUESTION, ANSWER, USED FROM JOKES");
};

let get_joke = async (id) => {
    return await sqlite.get("SELECT ID, QUESTION, ANSWER, USED FROM JOKES WHERE ID=" + id);
};

let get_used_jokes = async () => {
    return await sqlite.all("SELECT ID, QUESTION, ANSWER, USED FROM JOKES WHERE USED=1");
};

let add_joke = async (question, answer, used) => {
    // Check existence before adding a new joke
    await sqlite.get(`SELECT ID FROM JOKES WHERE QUESTION = "` + question +`" AND ANSWER = "` + answer + `" `)
        .then(async () => {
            throw new DuplicateResultError({
                question : question,
                answer : answer
            });
        }).catch(async (err) => {
            if (err instanceof EmptyResultError)
                return await sqlite.run(`INSERT INTO JOKES (QUESTION, ANSWER, USED) VALUES ("` + question + `", "` + answer + `", "` + used + `")`);
            throw err;
        });
};

let edit_joke = async (id, question, answer, used) => {
    return await sqlite.run(
        `UPDATE JOKES SET QUESTION="` + question + `", ANSWER="` + answer + `", USED="` + used + `" WHERE id=` + id
    );
};

let del_joke = async (id) => {
    return await sqlite.run("DELETE FROM JOKES WHERE ID=" + id);
};

module.exports = {
    get_jokes, get_joke, add_joke, edit_joke, del_joke, get_used_jokes
};