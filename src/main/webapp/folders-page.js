function navigateToFoldersViewer() {
    user = getAuthorization();
    
    const ownerXhr = new XhrSender('GET', 'protected/folder', onOwnerFoldersResponse);
    ownerXhr.send();
    
    const sharedXhr = new XhrSender('GET', 'protected/folder_share', onSharedFoldersResponse);
    sharedXhr.send();
    
}

function storeUserFolders(userFolders) {
    storeItem('userFolders', userFolders);
}

function retrieveUserFolders() {
    return retrieveItem('userFolders');
}

function onFoldersResponse() {
    
}

function onOwnerFoldersResponse() {
    handlePageTransition('folders-page');
    const foldersViewerEl = document.getElementById('owner-folders');
    removeAllChildren(foldersViewerEl);
    gFolderItemList = new ItemList('folders-table', onFolderClicked);
    gFolderItemList.setAsEditable(onFolderEditRequested);
    gFolderItemList.setAsCreatable(onFolderCreateRequested);
    if (hasAdminMode()) {
        const header = ['', '', 'Owner (click to change)', '', ''];
        gFolderItemList.setAsOwnable(onOwnerChangeRequested);
        gFolderItemList.header = header;
    }
    gFolderItemList.setAsDeletable(onFolderDeleteRequested);
    gFolderItemList.setAsShareable(onFolderShareRequested);

    const foldersTable = gFolderItemList.create();
    foldersViewerEl.appendChild(foldersTable);
    gFolderItemList.refreshWithNew(JSON.parse(this.responseText));
}

function onSharedFoldersResponse() {
    handlePageTransition('folders-page');
    console.log(this.responseText);
    const foldersViewerEl = document.getElementById('shared-folders');
    removeAllChildren(foldersViewerEl);
    gFolderItemList = new ItemList('shared-folders-table', onSharedFolderClicked);

    const foldersTable = gFolderItemList.create();
    foldersViewerEl.appendChild(foldersTable);
    gFolderItemList.refreshWithNew(JSON.parse(this.responseText));
}

function onFolderUpdateResponse() {
    handleMessage(this.responseText)
    navigateToFoldersViewer();
}

// Go to sketch

function onFolderClicked() {
    storeFolderId(this.getAttribute('item_id'));
    storeShareMode(false);
    navigateToFolderContent();
}

function onSharedFolderClicked() {
    storeFolderId(this.getAttribute('item_id'));
    storeShareMode(true);
    navigateToFolderContent();
}

// Create new

function onFolderCreateRequested(res) {
    const xhr = new XhrSender('POST', 'protected/folder', onFolderUpdateResponse)    
    xhr.addParam('name', res.name);
    xhr.send();
}

// Edit

function onFolderEditRequested(res) {
    const xhr = new XhrSender('PUT', 'protected/folder', onFolderUpdateResponse)
    xhr.addParam('folder_id', res.id);
    xhr.addParam('name', res.name);
    xhr.send();
}

// Delete

function onFolderDeleteRequested(res) {
    console.log(res);

    const xhr = new XhrSender('DELETE', 'protected/folder', onFolderUpdateResponse)
    xhr.addParam('folder_id', res.id);
    xhr.send();
}

// Share

function onFolderShareRequested() {
    const folderId = this.getAttribute('item_id');
    storeFolderId(folderId);
    navigateToFolderSharedPage();
}

// Change ownership (only in admin mode)

function onOwnerChangeRequested(res) {
    console.log(res);
    const xhr = new XhrSender('PUT', 'protected/folder_owner', onFolderUpdateResponse);
    xhr.addParam('folder_id', res.id);
    xhr.addParam('owner_name', res.name);
    xhr.send();
}