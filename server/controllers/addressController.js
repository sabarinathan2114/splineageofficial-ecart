import asyncHandler from 'express-async-handler';
import Address from '../models/addressModel.js';

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
    const { address, city, postalCode, country, isDefault } = req.body;

    if (isDefault) {
        await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const newAddress = await Address.create({
        user: req.user._id,
        address,
        city,
        postalCode,
        country,
        isDefault: isDefault || false,
    });

    res.status(201).json(newAddress);
});

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
const getUserAddresses = asyncHandler(async (req, res) => {
    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses);
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);

    if (address) {
        if (address.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this address');
        }
        await Address.deleteOne({ _id: address._id });
        res.json({ message: 'Address removed' });
    } else {
        res.status(404);
        throw new Error('Address not found');
    }
});

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);

    if (address) {
        if (address.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this address');
        }

        if (req.body.isDefault) {
            await Address.updateMany({ user: req.user._id }, { isDefault: false });
        }

        address.address = req.body.address || address.address;
        address.city = req.body.city || address.city;
        address.postalCode = req.body.postalCode || address.postalCode;
        address.country = req.body.country || address.country;
        address.isDefault = req.body.isDefault !== undefined ? req.body.isDefault : address.isDefault;

        const updatedAddress = await address.save();
        res.json(updatedAddress);
    } else {
        res.status(404);
        throw new Error('Address not found');
    }
});

export { addAddress, getUserAddresses, deleteAddress, updateAddress };
