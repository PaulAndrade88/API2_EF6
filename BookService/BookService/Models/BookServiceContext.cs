using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace BookService.Models
{
    public class BookServiceContext : DbContext
    {
    
        public BookServiceContext() : base("name=BookServiceContext")
        {
            //Trace SQL
            this.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
        }

        public System.Data.Entity.DbSet<BookService.Models.Author> Authors { get; set; }
        public System.Data.Entity.DbSet<BookService.Models.Book> Books { get; set; }
        
    
    }
}
