var ViewModel = function () {
    var self = this;
    self.books = ko.observableArray();
    self.error = ko.observable();
    var booksUri = '/api/books/';
    var authorsUri = '/api/authors/';
    authorSelectedId = { Id: ko.observable() };
    var listAuthors = [];

    function ajaxHelper(uri, method, data) {
        self.error('');// Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $('#divError').css('display', 'inline-block');
            self.error(errorThrown);
        });
    };

    function getAllBooks() {
        ajaxHelper(booksUri, 'GET').done(function (data) {
            self.books(data);
        });
    }
    //Fetch the initial data.
    getAllBooks();

    //GetBookDetail
    self.detail = ko.observable();
    self.bookSelected = ko.observable();
    self.getBookDetail = function (item) {
        ajaxHelper(authorsUri, 'GET').done(function (data) {
            listAuthors = data;
            for (var i = 0; i < listAuthors.length; i++) {
                if (listAuthors[i].Name == item.AuthorName) {
                    authorSelectedId.Id = listAuthors[i].Id;
                };
            };
        });
        
        ajaxHelper(booksUri + item.Id, 'GET').done(function (data) {
            self.bookSelected = item.Id;
            self.detail(data);
        });
        $('#divDetails').css('display', 'inline');
    };

    //AddNewBook
    self.authors = ko.observableArray();
    self.newBook = {
        Author: ko.observable(),
        Genre: ko.observable(),
        Price: ko.observable(),
        Title: ko.observable(),
        Year: ko.observable()
    }    

    function getAuthors() {
        ajaxHelper(authorsUri, 'GET').done(function (data) {
            self.authors(data);
        });
    }

    self.addBook = function (formElement) {
        var book = {
            AuthorId: self.newBook.Author().Id,
            Genre: self.newBook.Genre(),
            Price: self.newBook.Price(),
            Title: self.newBook.Title(),
            Year: self.newBook.Year()
        };

        ajaxHelper(booksUri, 'POST', book).done(function (item) {
            self.books.push(item);
        });
    }
    getAuthors();

    //DeleteBook
    self.deleteBook = function () {
        ajaxHelper(booksUri + self.bookSelected, 'DELETE').done(function (data) {
            var tableDetails = document.getElementById('tDetails');
            var tableRows = tableDetails.getElementsByTagName('tr');            
            for (var i = 0; i < tableRows.length; i++) {
                tableRows[i].className = "alert-danger";                
            };
            setTimeout(function () {
                tableDetails.innerHTML = "";
                //$.alert({
                //    title: 'Notification!',
                //    content: 'Book has been deleted!'
                //});
                alert("Book has been deleted!");
            },100);            
            getAllBooks();           
        });
    };

    
    self.editBook = function (formElement) {
        var bookId = self.bookSelected;
        var book = {
            Id: bookId,
            AuthorId: formElement[0].value,
            Title: formElement[1].value,
            Year: formElement[2].value,
            Genre: formElement[3].value,
            Price: formElement[4].value
        };
                
        ajaxHelper(booksUri + bookId, 'PUT', book).done(function () {
            getAllBooks();
            $('#lnkDetails').trigger("click");
            //$.alert({
            //    title: 'Notification!',
            //    content: 'The Book' + book.Tilte + 'has been updated!'
            //});
            alert("The Book " + book.Tilte + " has been updated!");
            $('#updateWindow').modal('hide');
        });        
    };

    
};

ko.applyBindings(new ViewModel());