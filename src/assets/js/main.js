var orbitVuUrl;
var modelTitle;

$('#arcModal').on('show.bs.modal', function (event) {
    // var button = $(event.relatedTarget);
    var file = orbitVuUrl;
    var modal = $(this);
    modal.find('.modal-title').text(modelTitle);
    let presentation = file.replace('.html', '/');
    inject_orbitvu(
        'orbit',
        './orbitvu12/orbitvuer12.swf',
        '',
        {
            ovus_folder: presentation,
            content2: 'yes',
            width: '600',
            height: '500'
        });

});

// function openInNewTab(url) {
//     var win = window.open(url, '_blank');
//     win.focus();
// }

function gatherData(url, title) {
    orbitVuUrl = url;
    modelTitle = title;
}
