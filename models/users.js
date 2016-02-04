"use strict";

module.exports = function(sequelize, DataTypes) {

  var User = sequelize.define("User", {
      firstName: {
        type: DataTypes.STRING
      },
      lastName: {
        type: DataTypes.STRING
      },
      middleName: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      token: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      verified: {
        type: DataTypes.BOOLEAN
      },
      plan: {
        type: DataTypes.STRING,
        defaultValue: 'free',
        allowNull: false
      }
    }
    // , {
    //   getterMethods   : {
    //     fullName       : function()  { return this.firstName + ' ' + this.lastName }
    //   },
    //   classMethods: {
    //     associate: function(models) {
    //       User.belongsToMany(models.Account, {through: models.AccountUser});
    //       User.hasMany(models.AccountUser);
    //       User.hasOne(models.Attachment, {
    //         foreignKey: 'attachmentable_id',
    //         constraints: false,
    //         as: 'ProfilePicture',
    //         scope: {
    //           attachmentable: 'user'
    //         }
    //       });
    //     }
    //   }
    // }
    );

  return User;
};