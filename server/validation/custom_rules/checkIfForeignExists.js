module.exports = async (value, Model) => {
    const object = await Model.findByPk(value);
    return object !== null;
}