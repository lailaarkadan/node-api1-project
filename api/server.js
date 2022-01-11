// BUILD YOUR SERVER HERE
const express = require("express");
const User = require("./users/model");

const server = express();

server.use(express.json());


server.post("/api/users", async (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name || !bio) {
      res
        .status(400)
        .json({ message: "Please provide name and bio for the user" });
    } else {
      const user = await User.insert({ name, bio });
      res.status(201).json(user);
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "There was an error while saving the user to the database",
      });
  }
});


server.get("/api/users", (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({
        message: "The users information could not be retrieved",
        error: err.message,
      });
    });
});

server.get('/api/users/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user) {
            res.status(404).json("The user with the specified ID does not exist")
        } else {
            res.status(200).json(user)
        }  
    }
    catch (err){
        res.status(500).json({ message: "The user information could not be retrieved" })
    }
})

server.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.remove(id);
        if (!deletedUser) {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        } else {
            res.json(deletedUser);
        }
    } catch (err) {
        res.status(500).json({ message: "The user could not be removed" });
    }
})


server.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio } = req.body;

    if (!name || !bio) {
      res
        .status(400)
        .json({ message: "Please provide name and bio for the user" });
    } else {
      const updatedUser = await User.update(id, { name, bio });
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "The user information could not be modified" });
  }
}); 


module.exports = server; // EXPORT YOUR SERVER instead of {}
