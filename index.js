var react = React;
var cartProducts = 0;

function Article(name, price) {
    this.id = ++cartProducts; 
    mobx.extendObservable(this, {
        name: name,
        price: price
    });
}

function ShoppingCartEntry(article) {
    this.id = ++cartProducts; // UUID for this entry
    mobx.extendObservable(this, {
        article: article,
        amount: 1,
        price: function() {
            return this.article ? this.article.price * this.amount : 0;
        }
    });
}

function ShoppingCart() {
    mobx.extendObservable(this, {
        entries: [],
        total: function() {
            return this.entries.reduce(function(sum, entry) {
                return sum + entry.price;
            }, 0);
        }
    });
}


var articles = mobx.observable([
    ["Apple", 17.63],
    ["Orange", 23.95],
    ["Banana", 50.00]
].map(function(e) {
    return new Article(e[0], e[1]);
}));

var shoppingCart = new ShoppingCart();

shoppingCart.entries.push(new ShoppingCartEntry(articles[0]));

var ShopDemoView = mobxReact.observer(React.createClass({
    displayName: 'ShopDemoView',
    render: function() {
       
        return (<table>
              
                <tr>
                    <td>
                        <h2>Availale items</h2>
                        <ArticlesView articles={this.props.articles} />
                    </td>
                    <td>
                        <h2>Your shopping cart</h2>
                        <CartView cart={this.props.cart} />
                    </td>
                </tr>
            </table>)
    },

}));

var ArticlesView = mobxReact.observer(React.createClass({
    displayName: 'ArticlesView',
    render: function() {
        
        function renderArticle(article) {
            return (<ArticleView article={article} key={article.id} />);
        }
        return (<div>
                
                <ul id="articles">{this.props.articles.map(renderArticle)}</ul>
            </div>)
    },

}));

var ArticleView = mobxReact.observer(React.createClass({
    displayName: 'ArticleView',

    render: function() {
        
        return (<li>
            <span>{this.props.article.name}</span>
            <button onClick={this.onAddArticle}>&raquo;</button>
          
            <span className="price">Rs {this.props.article.price} INR</span>
        </li>);
    },

    onAddArticle: function() {
        var existingEntry = shoppingCart.entries.find(function(entry) {
            return entry.article === this.props.article;
        }, this);
        if (existingEntry)
            existingEntry.amount += 1;
        else
            shoppingCart.entries.unshift(new ShoppingCartEntry(this.props.article));
    },

}));

var CartView = mobxReact.observer(React.createClass({
    displayName: 'CartView',
    
    render: function() {
       
        function renderEntry(entry) {
            return (<CartEntryView entry={entry} key={entry.id} />);
        }
        return (<div>
            <ul id="cart">{this.props.cart.entries.map(renderEntry)}</ul>
            <CartTotalView cart={this.props.cart} />
        </div>)
    }
}));

var CartTotalView = mobxReact.observer(React.createClass({
    displayName: 'CartTotalView',
    
    render: function() {
        
        return (<div><b>Total: <span id="total">{("Rs " + this.props.cart.total).replace(/(\.\d\d)\d*/,"$1")}</span></b></div>);
    }
}));

var CartEntryView = mobxReact.observer(React.createClass({
    displayName: 'CartEntryView',
    
    render: function() {
      
        return (<li>
            <button onClick={this.removeArticle}>&laquo;</button>
            <span>{this.props.entry.article.name}</span>
            <span className="price">{this.props.entry.amount}x</span>
        </li>);
    },

    removeArticle: function() {
        if (--this.props.entry.amount < 1)
            shoppingCart.entries.splice(shoppingCart.entries.indexOf(this.props.entry), 1);
    }
}));

React.render(<ShopDemoView articles={articles} cart={shoppingCart} />, document.getElementById("mount"));
