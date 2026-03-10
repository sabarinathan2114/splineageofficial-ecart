import mongoose from 'mongoose';

const tagSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;
