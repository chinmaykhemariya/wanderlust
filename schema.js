const joi=require("joi")
module.exports.dataSchema=joi.object({
    data:joi.object({
        title:joi.string().required(),
        description:joi.string().max(1000).required(),
        image:joi.string().allow("",null),
        price:joi.number().required().min(0),
        location:joi.string().required(),
        country:joi.string().required(),
        category:joi.string().valid("trendings","rooms","iconic cities","mountains","castels","pool","camping","farms","arctic").insensitive().required()

    }).required()
})

module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().min(1).max(5).required(),
        comment:joi.string().required()
    }).required()
})