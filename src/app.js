const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0
    };

    repositories.push(repository);

    return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const indexRepository = repositories.findIndex( re => re.id === id);

    if (indexRepository < 0) {
        return response.status(400).json({error: 'Project not found'});
    }

    const repository = {
        ...repositories[indexRepository],
        title,
        url,
        techs
    };

    repositories[indexRepository] = repository

    return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;

    const indexRepository = repositories.findIndex( re => re.id === id);

    if (indexRepository < 0) {
        return response.status(400).json({error: 'Project not found'});
    }

    repositories.splice(indexRepository, 1);
    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;
    const indexRepository = repositories.findIndex( re => re.id === id);

    if (indexRepository < 0 || !id) {
        return response.status(400).json({error: 'Project not found'});
    }

    repositories[indexRepository] = {
        ...repositories[indexRepository],
        likes: repositories[indexRepository].likes + 1
    }
    return response.json(repositories[indexRepository]);
});

module.exports = app;
