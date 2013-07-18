/**
 * TableView
 * 
 * @class
 * @author  Tim Davies <mail@timdavi.es>
 */
var TableView = Backbone.View.extend({
    /**
     * jQuery selector for the TableView
     * @type {String}
     */
    selector: '#main .tableview',
    
    
    /**
     * Initialise view, store query and watch for changes on the query rows
     * @param  {Query} query Query object to use
     * @return {undefined}
     */
    initialize: function(query) {
        var tableview = this;
        this.query = query;
        
        this.query.on('change:rows', function() {
            console.info("Query changed - rendering");
            tableview.render(false);
        });
        
        // Remove previous bindings:
        $('#statusbar').off();
        
        // Bind to onclick on the pagination buttons on the sidebar:
        $('#statusbar').on('click', 'div.right.btn', function() {
            if ($(this).hasClass('next')) {
                tableview.query.nextPage();
            } else if ($(this).hasClass('prev')) {
                tableview.query.prevPage();
            }
        });
    },
    
    
    /**
     * Render view
     * @param  {Boolean} execute_query Whether to execute query or not
     * @return {undefined}
     */
    render: function(execute_query) {
        console.info("Rendering tableview");
        
        var tableview = this;
        
        var callback = function() {
            // Render HTML:
            $('#main').html(_.template(
                $('#template-tableview').html(),
                {
                    tableview: tableview
                }
            ));
            
            // Get tableview selector:
            var selector = this.selector;
            
            // Bind to double-click event on cells:
            $(selector).find('tbody').on('dblclick', 'td', function() {
                $(selector).find('tbody td.active').removeClass('active');
                $(this).addClass('active').attr('contenteditable', 'true').selectText();
            });
            
            // Deselect cell if user moves on:
            $(selector).on('blur', 'tbody td.active', function() {
                $(this).removeClass('active');
            });
            
            // Bind to onclick on the pagination buttons in the titlebar:
            $('.titlebar').on('click', '.btn', function() {
                if ($(this).hasClass('next')) {
                    tableview.query.nextPage();
                } else if ($(this).hasClass('prev')) {
                    tableview.query.prevPage();
                }
            });
            
            // If enter key is pressed, send "blur" event to save the field:
            $(selector).on('keydown', 'td', function(e) {
                if (e.keyCode == '13') {
                    e.preventDefault();
                    $(this).blur();
                }
            });
            
            contentview.setLoading(false);
        };
        
        // If query has not yet been executed, it must be executed:
        if (execute_query || execute_query == undefined) {
            this.query.execute(callback);
        } else {
            callback();
        }
    }
});
