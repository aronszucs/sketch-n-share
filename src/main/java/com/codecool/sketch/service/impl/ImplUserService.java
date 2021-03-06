package com.codecool.sketch.service.impl;

import com.codecool.sketch.dao.UserDao;
import com.codecool.sketch.model.User;

import java.sql.SQLException;
import java.util.List;

import com.codecool.sketch.service.UserService;
import com.codecool.sketch.service.exception.ServiceException;


public final class ImplUserService extends ImplAbstractService implements UserService {

    private final UserDao userDao;

    public ImplUserService(User user, UserDao userDao) {
        super(user);
        this.userDao = userDao;
    }

    public ImplUserService(UserDao userDao) {
        super(null);
        this.userDao = userDao;
    }

    public List<User> fetchAll() throws SQLException, ServiceException {
        if (adminMode) {
            return userDao.featchAll();
        } else {
            throw new ServiceException("User has no admin privileges!");
        }
    }

    public User fetchById(String id) throws SQLException, ServiceException {
        if (adminMode) {
            return userDao.fetchById(fetchInt(id, "id"));
        } else {
            throw new ServiceException("User has no admin privileges!");
        }
    }

    public List<User> fetchBySharedFolder(String folderId) throws SQLException, ServiceException {
        if (adminMode) {
            return null;
        } else {
            return userDao.fetchBySharedFolder(fetchUserId(), fetchInt(folderId, "folderId"));
        }
    }



    public void shareFolderWithUser(String userName, String folderId) throws SQLException, ServiceException {

        userDao.shareFolderWithUser(fetchUserId(), userName, fetchInt(folderId, "folderId"));
    }

    public void unshareFolderWithUser(String userId, String folderId) throws SQLException, ServiceException {
        int userIdVal = fetchInt(userId, "userId");
        int folderIdVal = fetchInt(folderId, "folderId");
        userDao.unshareFolderWithUser(fetchUserId(), userIdVal, folderIdVal);
    }

    public void add(String name, String password, String role) throws SQLException, ServiceException {
        if (adminMode) {
            userDao.add(name, password, getRoleInt(role));
        } else {
            throw new ServiceException("User has no admin privileges!");
        }
    }

    public boolean delete(String id) throws SQLException, ServiceException {
        if (adminMode) {
            int idVal = fetchInt(id, "id");
            userDao.delete(idVal);
            if (idVal == fetchUserId()) {
                return true;
            }
        } else {
            throw new ServiceException("User has no admin privileges!");
        }
        return false;
    }

    public boolean modify(String userId, String name, String password, String role) throws SQLException, ServiceException {
        if (adminMode) {
            int userIdVal = fetchInt(userId, "userId");
            userDao.modify(fetchInt(userId, "userId"), name, password, getRoleInt(role));
            if (userIdVal == fetchUserId()) {
                return true;
            }
        } else {
            throw new ServiceException("User has no admin privileges!");
        }
        return false;
    }

    private int getRoleInt(String role) throws ServiceException {
        switch (role) {
            case "ADMIN":
                return 1;
            case "REGULAR":
                return 0;
            default:
                throw new ServiceException("role must be one of the following: ADMIN, REGULAR");
        }
    }


}
