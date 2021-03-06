




function navigateToCanvas() {
    user = getAuthorization();
    let xhr;
    if (hasShareMode()) {
        xhr = new XhrSender('GET', 'protected/sketch_shared', onCanvasResponse);
    } else {
        xhr = new XhrSender('GET', 'protected/sketch', onCanvasResponse);
    }
    xhr.addParam('sketch_id', retrieveSketchId());
    xhr.send();
}

function storeSketchId(sketch) {
    storeItem('sketch', sketch);
}

function retrieveSketchId() {
    return retrieveItem('sketch');
}

function storeSketchHeader(id, name, folderId) {
    let header = {}
    header.id = id;
    header.name = name;
    header.folderId = folderId;
    storeItem('sketchHeader', header);
}

function retrieveSketchHeader() {
    return retrieveItem('sketchHeader');
}

function onCanvasResponse() {
    handlePageTransition("canvas-page");
    const shapeCreator = new ShapeCreator();
    gCanvas = new Canvas(shapeCreator, document.getElementById('canvas-page'), document.getElementById('canvas'));

    const data = JSON.parse(this.responseText);
    storeSketchHeader(data.id, data.name, data.folderId);
    const content = JSON.parse(data.content);
    gCanvas.loadDrawObjects(convertDtoToDrawObjects(content));
    gCanvas.addDrawButton(document.getElementById('canvas-drawmode-draw'));
    gCanvas.addDeleteButton(document.getElementById('canvas-drawmode-delete'));
    gCanvas.addMessageHandler(handleTextMessage);

    console.log(content);
    gCanvas.refresh()
}

// Save


function onCanvasSaveClick() {
    const header = retrieveSketchHeader();
    const dtoJson = JSON.stringify(convertDrawObjectsToDto(gCanvas.drawObjects));
    const xhr = new XhrSender('POST', 'protected/sketch', onCanvasSaveResponse);
    xhr.addParam('sketch_id', retrieveSketchId());
    xhr.addParam('folder_id', header.folderId);
    xhr.addParam('name', header.name);
    xhr.addParam('content', dtoJson);
    xhr.send();
}

function onCanvasBackButtonClicked() {
    navigateToFolderContent();
}

function onCanvasSaveResponse() {
    handleMessage(this.responseText)
}

// Data handling
