let jokes_dao = require("./jokes.dao");
const string_handler = require("../utils/string_handler");

const find_all_jokes = async () => {
    return await jokes_dao.get_jokes();
};

const get_joke = async (id) => {
    return await jokes_dao.get_joke(id);
};

const add_joke = async (question, answer) => {
    answer = string_handler.upperFirstLetter(answer);
    question = string_handler.upperFirstLetter(question);
    return await jokes_dao.add_joke(question, answer, 1); //Used = 1 as default for all the new jokes
};

const edit_joke = async (id, question, answer, used) => {
    answer = string_handler.upperFirstLetter(answer);
    question = string_handler.upperFirstLetter(question);
    return await jokes_dao.edit_joke(id, question, answer, used);
};

const del_joke = async (id) => {
    return await jokes_dao.del_joke(id);
};

const rdm_joke = async () => {
    let jokes =  await jokes_dao.get_used_jokes().catch((err) => {
        throw err;
    });
    let i = Math.floor(Math.random() * jokes.length);
    return jokes[i];
};

module.exports = {
    find_all_jokes, get_joke, add_joke, edit_joke, del_joke, rdm_joke
};

