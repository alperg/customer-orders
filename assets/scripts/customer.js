var apiURL = 'https://simple-apis.herokuapp.com/customers';
var allCustomers = [];
var filteredCustomers = [];

function renderCard(customer, index) {
  console.log(customer, index);

  var col = $('<div>').addClass('col-lg-4 card-wrapper');
  col.attr('style', 'animation-delay: ' + 80 * index + 'ms');

  var card = $('<div>').addClass('card');

  var cardHeader = $('<div>').addClass('card-header');
  cardHeader.html('<strong>Customer: ' + customer.firstName + ' ' + customer.lastName + '</strong>');

  var cardBody = $('<div>').addClass('card-body');

  var left = $('<div>').addClass('left');

  var img = $('<img>')
    .addClass('img-thumbnail mb-2')
    .attr('style', 'width: 70px;')
    .attr('src', 'assets/images/' + customer.gender + '.png');

  left.append(img);

  var right = $('<div>').addClass('right');
  right.append('<p>Address:</p>');

  var fullAddress = customer.address + ', ' + customer.city + ' ' + customer.state.abbreviation;
  right.append('<p>' + fullAddress + '</p>');
  right.append('<hr />');
  right.append('<p>Order Total: <strong>$' + customer.orderTotal.toFixed(2) + '</strong></p>');

  var btnView = $('<button>').addClass('btn btn-sm btn-primary');
  btnView.append("<i class='fa fa-search mr-1'>");
  btnView.append('View Order');
  btnView.attr('data-toggle', 'modal');
  btnView.attr('data-target', '#ordersModal');
  btnView.attr('data-customer-id', customer.id);
  btnView.attr('data-customer-name', customer.firstName + ' ' + customer.lastName);

  right.append(btnView);

  cardBody.append(left, right);

  card.append(cardHeader, cardBody);

  col.append(card);

  return col;
}

function getCustomers() {
  $.ajax({
    url: apiURL,
    method: 'GET'
  }).then(function (response) {
    allCustomers = [...response];
    filteredCustomers = [...response];
    renderCustomers(response);
  });
}

function renderCustomers(response) {
  $('.customer-cards').empty();

  response.forEach(function (customerData, index) {
    var customerCard = renderCard(customerData, index);
    $('.customer-cards').append(customerCard);
  });
}

$('#ordersModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var customerId = button.attr('data-customer-id'); // Extract info from data-* attributes
  var customerName = button.attr('data-customer-name'); // Extract info from data-* attributes

  var modal = $(this);
  modal.find('.modal-title').text('Orders for ' + customerName);

  $.ajax({
    url: apiURL + '/' + customerId + '/orders',
    method: 'GET'
  }).then(function (orderInfo) {
    console.log(orderInfo); // this is the order info for a particular customer
    renderOrdersTable(orderInfo.orderItems);
  });
});

function renderOrdersTable(orders) {
  var tbody = $('#tbody');
  tbody.empty();

  var sum = 0;

  orders.forEach(function (order) {
    sum = sum + order.itemCost; // can also be written as sum += order.itemCost

    var tr = $('<tr>');

    var idTd = $('<td>').text(order.id);
    var nameTd = $('<td>').text(order.productName);
    var costTd = $('<td>').text(order.itemCost.toFixed(2)).addClass('number');

    tr.append(idTd, nameTd, costTd);

    tbody.append(tr);
  });

  var sumTr = $('<tr>');

  var sumTitleTd = $('<td>').html('<strong>Orders Total:</strong>');
  var sumEmptyTd = $('<td>');
  var sumTd = $('<td>')
    .html('<strong>' + sum.toFixed(2) + '</strong>')
    .addClass('number');

  sumTr.append(sumTitleTd, sumEmptyTd, sumTd);

  tbody.append(sumTr);
}

$('#txtSearch').on('keyup', function (event) {
  const searchTerm = event.target.value;

  // if the search term is empty, render all customers
  if (searchTerm === '') {
    return renderCustomers(allCustomers);
  }

  filteredCustomers = allCustomers.filter(function (customer) {
    if (customer.firstName.toLowerCase().includes(searchTerm) || customer.lastName.toLowerCase().includes(searchTerm)) {
      return true;
    }
    return false;
  });

  renderCustomers(filteredCustomers);
});

getCustomers();
