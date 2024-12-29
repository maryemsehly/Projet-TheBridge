const Item = require('../models/itemModel');

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch items. Please try again later.' });
    }
};

exports.createItem = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const pic = req.file ? req.file.filename : null; // Save the file's name if uploaded

        // Validate the image file (if present)
        if (req.file && !['image/jpeg', 'image/png', 'image/gif'].includes(req.file.mimetype)) {
            return res.status(400).json({ error: 'Only JPEG, PNG, and GIF images are allowed.' });
        }

        // Create a new item with the uploaded image filename
        const item = new Item({
            name,
            description,
            price,
            pic
        });

        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message || 'Failed to create item.' });
    }
};

exports.updateItem = async (req, res) => {
    try {
        // Validate the image file if uploaded
        if (req.file && !['image/jpeg', 'image/png', 'image/gif'].includes(req.file.mimetype)) {
            return res.status(400).json({ error: 'Only JPEG, PNG, and GIF images are allowed.' });
        }

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // If an image was uploaded, update the picture field
        if (req.file) {
            updatedItem.pic = req.file.filename;
        }

        await updatedItem.save();
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message || 'Failed to update item.' });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        
        // If the item exists, send a success response
        if (item) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete item. Please try again later.' });
    }
};
