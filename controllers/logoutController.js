// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function(data){this.users = data}
// }

const fsPromises = require('fs')

const User = require('../model/User')

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken
    const cookies =  req.cookies;
    if(!cookies.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;


    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser){
        res.clearCookie('jwt', {httpOnly: true});
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);
    // const otherUsers = usersDB.users.filter(person => person.refreshToke !== foundUser.refreshToken);
    // const currentUser = {...foundUser, refreshToken: ''};
    // usersDB.setUsers([...otherUsers, currentUser]);
    // await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'),
    // JSON.stringify(usersDB.users));
    res.clearCookie('jwt', {httpOnly: true}); //secure: true - only serves on https
    res.sendStatus(204);
}

module.exports = {handleLogout}