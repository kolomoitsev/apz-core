const express = require("express");
const router = express.Router();

const animalModel = require("./../models/animal.model");
const animalLocationModel = require("./../models/animal-location.model");
const { authenticateToken } = require("./../helpers/index");

router
  //get all animals
  .get("/", authenticateToken, async (req, res) => {
    try {
      const animals = await animalModel.find({});

      if (animals.length) {
        return res.status(200).json(animals);
      } else {
        return res.status(404).json({
          error: "Not found",
        });
      }
    } catch (e) {
      return res.status(500).json({
        error: "Error with finding animals",
        e,
      });
    }
  })
  //add new animal
  .post("/", authenticateToken, async (req, res) => {
    const { reservationId, animalName, animalRfdi, animalStatus } = req.body;

    const animal = new animalModel({
      reservationId,
      animalName,
      animalRfdi,
      animalStatus,
    });

    await animal
      .save()
      .then(() => res.status(200).json(animal))
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          error: "Error with creating new animal",
          err,
        });
      });
  })
  //get exact animal
  .get("/:animal_id", authenticateToken, async (req, res) => {
    const { animal_id } = req.params;
    try {
      const animal = await animalModel.findById(animal_id);
      if (animal) {
        return res.status(200).json(animal);
      } else
        return res.status(404).json({
          error: "Not found",
        });
    } catch (e) {
      return res.status(500).json({
        error: "Error with finding exact animal",
      });
    }
  })
  //edit exact animal
  .patch("/:animal_id", authenticateToken, async (req, res) => {
    const { animal_id } = req.params;
    const { reservationId, animalName, animalRfdi, animalStatus } = req.body;
    try {
      const animal = await animalModel.findByIdAndUpdate(animal_id, {
        reservationId,
        animalName,
        animalRfdi,
        animalStatus,
      });
      if (animal) {
        return res.status(200).json(animal);
      } else
        return res.status(404).json({
          error: "Not found",
        });
    } catch (e) {
      return res.status(500).json({
        error: "Error with updating exact animal",
      });
    }
  })
  //delete exact animal
  .delete("/:animal_id", authenticateToken, async (req, res) => {
    const { animal_id } = req.params;
    try {
      const remove = await animalModel.findByIdAndDelete(animal_id);
      if (remove) {
        return res.status(200).json({
          message: "Successfully deleted",
        });
      } else {
        return res.status(404).json({
          error: "Not found",
        });
      }
    } catch (e) {
      return res.status(500).json({
        error: "Error with deleting exact animal",
      });
    }
  })
  //get animal coordinates
  .get("/coordinates/:animal_id", authenticateToken, async (req, res) => {
    const { animal_id } = req.params;
    try {
      const animalCoordinates = await animalLocationModel.find({
        animalId: animal_id,
      });
      if (animalCoordinates) {
        return res.status(200).json(animalCoordinates);
      } else
        return res.status(404).json({
          error: "Not found",
        });
    } catch (e) {
      return res.status(500).json({
        error: "Error with finding exact animal coordinates",
      });
    }
  })
  //add animal coordinates
  .post("/coordinates/:animal_id", async (req, res) => {
    const { animal_id } = req.params;

    const { animalLocationLat, animalLocationLng } = req.body;

    const animalCoordinates = new animalLocationModel({
      animalId: animal_id,
      animalLocationLat,
      animalLocationLng,
      animalLocationTime: new Date().toJSON(),
    });

    await animalCoordinates
      .save()
      .then(() => res.status(200).json(animalCoordinates))
      .catch((err) =>
        res.status(500).json({
          error: "Error with creating new animal coordinates",
          err,
        })
      );
  });

module.exports = router;
