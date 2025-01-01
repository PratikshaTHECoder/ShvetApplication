
const { StatusCodes, Messages } = require('../Constant');
const db = require('../models');
const COURSE = db.Course;
const SUBCATEGORY = db.SubCategory;
const CATEGORY = db.Category;
const USER = db.User;



const addCategory = async (req, res) => {
    const { categoryName } = req.body;
    const categoryImage = req.file ? req.file.path : null;
    const userId = req.user.id;
    try {
        if (!categoryName) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.STATUSERROR,
                Messages: Messages.CATEGORYNAMEFIELDERROR,
            });
        }
        if (!categoryImage) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.STATUSERROR,
                Messages: Messages.CATEGORYIMAGEERROR,
            });
        }
        const userExist = await USER.findOne({ where: { id: userId } });
        if (!userExist) {
            return res.status(StatusCodes.CONFLICT).json({
                status: StatusCodes.STATUSSUCCESS,
                message: Messages.UserNotExist,
            });
        }
        const DataAddCategory = await CATEGORY.create({
            userId,
            categoryName,
            categoryImage
        })
        res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.STATUSERROR,
            Messages: Messages.CATEGORYNAMEFIELDERROR,
            data: { id: DataAddCategory.id, userId: DataAddCategory.userId, categoryName: DataAddCategory.categoryName }
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.STATUSERROR,
            message: Messages.Error,
            error: error.message,
        });
    }
}

const addSubCategory = async (req, res) => {
    const { categoryId, categoryName } = req.body;
    try {
        if (!categoryName) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.STATUSERROR,
                Messages: Messages.CATEGORYERROR,
            });
        }
        if (!categoryId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.STATUSERROR,
                Messages: Messages.CATEGORYIDFIELDREQUIRED,
            });
        }
        const DataAddSubCategory = await SUBCATEGORY.create({
            categoryName,
        });
        res.status(StatusCodes.OK).json({
            status: StatusCodes.STATUSSUCCESS,
            messages: Messages.SUBCATEGORYSUCCESS,
            data: {
                id: DataAddSubCategory.id,
                category: DataAddSubCategory.categoryName,
            },
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.STATUSERROR,
            message: Messages.Error,
            error: error.message,
        });
    }
};


const addCourse = async (req, res) => {
    const { course, SubCategoryId } = req.body
    try {
        if (!course) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.STATUSERROR,
                message: Messages.COURSEFILDEERROR
            })
        }
        if (!SubCategoryId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.STATUSERROR,
                message: Messages.SUBCATEGORY
            })
        }
        const AddCourse = await COURSE.create({
            course
        })
        res.status(StatusCodes.OK).json({
            status: StatusCodes.STATUSSUCCESS,
            message: Messages.COURSADDSUCCESS,
            data: { id: AddCourse.id, course: AddCourse.course },
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.STATUSERROR,
            message: Messages.Error,
            error: error.message,
        });
    }
}

module.exports = {
    addCategory,
    addSubCategory,
    addCourse
}