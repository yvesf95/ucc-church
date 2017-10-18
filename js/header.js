// document.addEventListener('DOMContentLoaded', function () {
    // Get the link element that references the header.html file.
    var headerImport = document.getElementById('header-link');
    console.log(headerImport);

    // Get the contents of the import document
    var header = headerImport.import;
    console.log(header);

    // Get the template.
    var template = header.getElementById('navbar');
    console.log(template);

    // Clone the template content.
    var clone = document.importNode(template.content, true);
    console.log(clone);
    
    // Add the blog post to the page.
    document.getElementById('navbar').appendChild(clone);
// });