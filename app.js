// Mendapatkan query string dari URL
var queryString = window.location.search;

// Parse query string menjadi objek JavaScript
var params = new URLSearchParams(queryString);

var packet = 0;
var quantityBuburA_half = 0;
var quantityBuburA_1 = 0;
var quantityBuburB_half = 0;
var quantityBuburB_1 = 0;
var quantityNasiTim_half = 0;
var quantityNasiTim_1 = 0;
var quantitySup = 0;
var quantityJusBuah = 0;
var quantityPaketBuburFrozen = 0;
var quantityBuburFrozen = 0;
var quantityBuburFrozenSalmon = 0;
var quantityPaketNasiTimFrozen = 0;
var quantityNasiTimFrozen = 0;
var quantityNasiTimFrozenSalmon = 0;

// Mendapatkan nilai variabel var
packet = params.get('packet');
quantityBuburA_half = params.get('buburA_half');
quantityBuburA_1 = params.get('buburA_1');
quantityBuburB_half = params.get('buburB_half');
quantityBuburB_1 = params.get('buburB_1');
quantityNasiTim_half = params.get('nasitim_half');
quantityNasiTim_1 = params.get('nasitim_1');
quantitySup = params.get('sup');
quantityJusBuah = params.get('jusbuah');
quantityPaketBuburFrozen = params.get('paketbuburfrozen');
quantityBuburFrozen = params.get('buburfrozen');
quantityBuburFrozenSalmon = params.get('buburfrozensalmon');
quantityPaketNasiTimFrozen = params.get('paketnasitimfrozen');
quantityNasiTimFrozen = params.get('nasitimfrozen');
quantityNasiTimFrozenSalmon = params.get('nasitimfrozensalmon');

var confirm = 0;

document.getElementById('dateForm').addEventListener('submit', function (event)
{
    event.preventDefault();
    var selectedDate = new Date(document.getElementById('date').value);

    // Mendapatkan tanggal hari ini
    var today = new Date();

    // Menghitung tanggal minimal yang diperbolehkan (hari ini atau setelahnya)
    var minDate = new Date(today);
    minDate.setDate(today.getDate()); // Mengatur tanggal minimal ke hari sebelumnya

    // Memeriksa apakah tanggal yang dipilih oleh pengguna adalah minimal hari ini atau setelahnya
    if (selectedDate > minDate)
    {
        // Jika iya, lanjutkan dengan menampilkan menu
        confirm++;
        displayMenus(selectedDate);
        updateOrderMethodCost();
    } else
    {
        // Jika tidak, tampilkan pesan kesalahan
        var errorMessage = document.createElement('div');
        errorMessage.className = 'custom-alert';
        errorMessage.innerHTML = '<span class="close-btn" onclick="this.parentElement.style.display=\'none\'">&times;</span><i class="fas fa-exclamation-circle"></i><p>Harap masukkan tanggal pemesanan</p>';
        document.body.appendChild(errorMessage);
    }


});


document.getElementById('logOrdersBtn').addEventListener('click', function ()
{
    var selectedDateInitial = document.getElementById('date').value;
    if ((selectedDateInitial === "" || isNaN(new Date(selectedDateInitial).getTime())) || confirm == 0)
    {
        // Jika kosong atau tidak valid, tampilkan pesan kesalahan
        var errorMessage = document.createElement('div');
        errorMessage.className = 'custom-alert';
        errorMessage.innerHTML = '<span class="close-btn" onclick="this.parentElement.style.display=\'none\'">&times;</span><i class="fas fa-exclamation-circle"></i><p>Harap masukkan tanggal pemesanan dan klik confirm</p>';
        document.body.appendChild(errorMessage);
    } else
    {
        var overallItems = document.querySelectorAll('.menu .quantity');
        var overallTotal = 0;
        var ordersByDay = {}; // Objek untuk menyimpan detail pesanan berdasarkan dayIndex
        var selectedDate = new Date(document.getElementById('date').value); // Mengambil tanggal yang dipilih oleh pengguna
        var message = ''; // Variabel untuk menyimpan pesan yang akan dikirim
        var totalDaysWithOrders = 0;

        var authOrder = document.getElementById('orderMethod').value; // Mendapatkan nilai opsi yang dipilih
        var authOutletOption = document.getElementById('outletOption').value; // Mendapatkan nilai opsi yang dipilih
        if (authOrder === '')
        {
            var errorMessage = document.createElement('div');
            errorMessage.className = 'custom-alert';
            errorMessage.innerHTML = '<span class="close-btn" onclick="this.parentElement.style.display=\'none\'">&times;</span><i class="fa-solid fa-circle-exclamation"></i><p>Harap memilih metode pemesanan</p>';
            document.body.appendChild(errorMessage);
        } else
        {
            if (authOrder === 'outlet' && authOutletOption === '')
            {
                var errorMessage = document.createElement('div');
                errorMessage.className = 'custom-alert';
                errorMessage.innerHTML = '<span class="close-btn" onclick="this.parentElement.style.display=\'none\'">&times;</span><i class="fa-solid fa-circle-exclamation"></i><p>Harap memilih lokasi outlet</p>';
                document.body.appendChild(errorMessage);
            } else
            {
                overallItems.forEach(function (item)
                {
                    var quantity = parseInt(item.value);
                    if (quantity > 0)
                    {
                        var dayIndex = item.closest('.menu').nextElementSibling.dataset.day;
                        var price = parseFloat(item.getAttribute('data-price'));
                        var totalPerItem = price * quantity;
                        overallTotal += totalPerItem;
                        // Menghitung tanggal untuk dayIndex saat ini
                        var currentDate = new Date(selectedDate);
                        currentDate.setDate(currentDate.getDate() + parseInt(dayIndex)); // Menambahkan jumlah hari sesuai dengan indeks hari
                        // Menambah detail pesanan ke objek ordersByDay
                        if (!ordersByDay[currentDate.getTime()])
                        {
                            ordersByDay[currentDate.getTime()] = {
                                date: currentDate,
                                orders: []
                            };
                            totalDaysWithOrders++;
                        }
                        var itemName = item.previousElementSibling.textContent.trim();
                        var nameAndPrice = itemName.split(' ⤷ '); // Misalnya, jika nama dan harga dipisahkan oleh tanda hubung "-"
                        var name = nameAndPrice[0]; // Bagian pertama adalah nama
                        var price = nameAndPrice[1]; // Bagian kedua adalah harga

                        ordersByDay[currentDate.getTime()].orders.push({
                            name: name,
                            price: price,
                            quantity: quantity,
                            total: totalPerItem
                        });
                    }
                });

                // Membuat pesan yang berisi detail pesanan
                Object.keys(ordersByDay).forEach(function(dayIndex) {
                    var currentDate = new Date(parseInt(dayIndex));
                    var options = { day: 'numeric', month: 'long', year: 'numeric' }; // Opsi untuk tanggal lokal
                    var formattedDate = currentDate.toLocaleDateString('id-ID', options); // Menggunakan opsi lokal Indonesia (id-ID)
                    message += '➲ ' + formattedDate + ':\n';
                
                    ordersByDay[dayIndex].orders.forEach(function(order) {
                        message += '    ✧' + order.name + '\n' + '          ' + order.quantity + ' x ' + order.price + ' = Rp' + order.total + '\n';
                    });
                    message += '\n';
                });
                

                // Menambahkan total keseluruhan
                message += '⚬ _*Total Produk ' + totalDaysWithOrders + ' Hari: Rp' + overallTotal + '*_' + '\n';

                var selectedMethod = document.getElementById('orderMethod').value; // Mendapatkan nilai opsi yang dipilih

                // Menambahkan teks metode pemesanan ke dalam pesan
                if (selectedMethod === 'outlet')
                {
                    message += '⚬ _*Metode pemesanan: Outlet*_\n';
                } else if (selectedMethod === 'delivery-transfer')
                {
                    message += '⚬ _*Metode pemesanan: Delivery transfer*_\n';
                } else if (selectedMethod === 'cod')
                {
                    message += '⚬ _*Metode pemesanan: Delivery COD*_\n';
                } else if (selectedMethod === 'delivery-luar-jangkauan')
                {
                    message += '⚬ _*Metode pemesanan: Delivery luar jangkauan*_\n';
                } else if (selectedMethod === "delivery-luar-kota")
                {
                    message += '⚬ _*Metode pemesanan: Delivery luar kota*_\n';
                } else
                {
                    message += '*Pilih metode pemesanan*\n';
                }

                if (authOrder === 'outlet')
                {
                    if (authOutletOption === 'brosot')
                    {
                        message += '⚬ _*Lokasi outlet : Brosot*_\n';
                    } else if (authOutletOption === 'wates')
                    {
                        message += '⚬ _*Lokasi outlet : Wates*_\n';
                    }
                }

                var orderMethodCost = updateOrderMethodCost();
                // Menambahkan teks biaya metode pemesanan ke dalam pesan

                if (!(selectedMethod === 'delivery-luar-kota')) {
                    message += '⚬ _*Ongkos Kirim: Rp' + orderMethodCost + '*_' + '\n';
                } else {
                    message += '⚬ _*Ongkos Kirim: Admin akan menentukan ongkos kirim*_\n';
                }

                var finalMethodElement = document.getElementById('finalMethod');
                if (finalMethodElement)
                {
                    var totalAmountText = finalMethodElement.textContent.match(/Rp(\d+(\.\d+)*)/)[1];
                    message += '____________________________________\n'
                    if (!(selectedMethod === 'delivery-luar-kota')) {
                        message += '⚝ *Total: Rp' + totalAmountText + '* ⚝' + '\n'; // Menambahkan pesan dari finalMethodElement ke dalam pesan WhatsApp
                    } else {
                        message += '⚝ *Total: Rp' + totalAmountText + ' + Biaya ongkir* ⚝\n';
                    }
                } else
                {
                    console.error("Elemen '#finalMethod' tidak ditemukan.");
                }

                var encodedMessage = encodeURIComponent(message);
                var phoneNumber = '+6281215622101'; // Nomor WhatsApp tujuan
                var whatsappURL = 'https://wa.me/' + phoneNumber + '?text=' + encodedMessage;
                window.open(whatsappURL, '_blank');
            }
        }
    }
});





// ------------------------------------------------------------------------------------------------------------



function displayMenus(selectedDate)
{
    var menuSectionDiv = document.getElementById('menuSection');
    menuSectionDiv.innerHTML = ''; // Kosongkan konten sebelum menambahkan menu untuk 7 hari ke depan

    var currentDateInitial = new Date(selectedDate.getTime());

    var totalOverall = 0; // Initialize overall total price

    if((packet == 30 || packet == 31) && currentDateInitial.getDate() === 1) {
        packet = new Date(currentDateInitial.getFullYear(), currentDateInitial.getMonth() + 1, 0).getDate();
    } else if (packet == 31 && !(currentDateInitial.getDate() === 1)) {
        packet = 30;
    }

    // Perulangan untuk menampilkan menu untuk 7 hari ke depan
    for (var i = 0; i < packet; i++)
    {
        var currentDate = new Date(selectedDate.getTime()); // Salin tanggal yang dipilih
        currentDate.setDate(selectedDate.getDate() + i); // Tambahkan i hari ke tanggal yang dipilih

        var dateInfoDiv = document.createElement('div');
        dateInfoDiv.textContent = getDayName(currentDate.getDay()) + ', ' + currentDate.getDate() + ' ' + getMonthName(currentDate.getMonth()) + ' ' + currentDate.getFullYear() + '\n'; // Menampilkan informasi tanggal
        dateInfoDiv.style.backgroundColor = '#deffe0'; // Set background color to light green
        dateInfoDiv.style.width = '100%'; // Set width to 100% to fill the parent div
        dateInfoDiv.style.borderRadius = '10px';
        dateInfoDiv.style.padding = '5px';
        dateInfoDiv.style.textAlign = 'left'; // Set text alignment to center
        menuSectionDiv.appendChild(dateInfoDiv);

        var toggleButton = document.createElement('button');
        toggleButton.textContent = 'Sembunyikan';
        toggleButton.classList.add('toggle-button');
        toggleButton.setAttribute('data-menu', 'menu-' + i); // Set atribut data-menu untuk mengidentifikasi menu yang terkait
        dateInfoDiv.appendChild(toggleButton);
        toggleButton.style.float = 'right'; // Set toggleButton ke kiri
        toggleButton.style.background = 'transparent'; // Atur latar belakang tombol menjadi transparan
        toggleButton.style.border = 'none'; // Hapus border
        toggleButton.style.color = '#000'; // Atur warna teks menjadi hitam
        toggleButton.style.padding = 0; // Atur warna teks menjadi hitam


        menuSectionDiv.appendChild(document.createElement('br'));


        var menuDiv = document.createElement('div');
        menuDiv.classList.add('menu');
        menuDiv.classList.add('menu-' + i); // Tambahkan kelas untuk mengidentifikasi menu
        menuSectionDiv.appendChild(menuDiv);

        var menuItems = getMenuForDay(currentDate.getDay());

        console.log(currentDate);

        var changeMenuOne = new Date('Sat Feb 01 2025 00:00:00 GMT+0700 (Waktu Indonesia Barat)');
        var changeMenuTwo = new Date('Sat Mar 01 2025 00:00:00 GMT+0700 (Waktu Indonesia Barat)');

        console.log(changeMenuOne);

        // if(currentDate >= changeMenuOne)
        // {
        //     menuItems = getMenuForDayTemporaryOne(currentDate.getDay())
        // } 
        
        if(currentDate >= changeMenuOne && currentDate < changeMenuTwo)
        {
            menuItems = getMenuForDayTemporaryOne(currentDate.getDay())
        } 
        else if (currentDate >= changeMenuTwo)
        {
            menuItems = getMenuForDayTemporaryTwo(currentDate.getDay())
        }

        var total = 0; // Initialize total price

        menuItems.forEach(function (item)
        {
            var menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('menu-item');
            menuItemDiv.innerHTML = `
                <span>${item.name} <br>⤷ Rp${item.price}</span>
                <input type="number" min="0" value="${item.defaultQuantity || 0 }" class="quantity" data-price="${item.price}">
            `;
            menuDiv.appendChild(menuItemDiv);

            // Update total based on default quantity for each item
            total += item.price * (item.defaultQuantity || 0);
        });

        // Display total for each day
        var totalDiv = document.createElement('div');
        totalDiv.classList.add('total');
        totalDiv.dataset.day = i; // Add day index as data attribute
        totalDiv.textContent = 'Total: Rp' + total;
        totalDiv.style.color = 'green';
        menuSectionDiv.appendChild(totalDiv);

        menuSectionDiv.appendChild(document.createElement('br'));

        totalOverall += total; // Add total for the current day to overall total
    }

    // Display overall total at the bottom
    var totalOverallDiv = document.createElement('div');
    totalOverallDiv.classList.add('overall-total'); // Add class for styling
    totalOverallDiv.textContent = 'Total Seluruh Hari: Rp' + totalOverall;
    menuSectionDiv.appendChild(totalOverallDiv);

    // Event listener for quantity change
    menuSectionDiv.addEventListener('input', updateTotal);

    // Event listener for toggle button
    var toggleButtons = document.querySelectorAll('.toggle-button');

    toggleButtons.forEach(function (button)
    {
        button.addEventListener('click', function ()
        {
            var menuId = button.getAttribute('data-menu');
            var menu = document.querySelector('.' + menuId);
            if (menu.style.display === 'none')
            {
                menu.style.display = 'block'; // Show the menu
                button.textContent = 'Sembunyikan'; // Ubah teks tombol menjadi 'Sembunyikan'
            } else
            {
                menu.style.display = 'none'; // Hide the menu
                button.textContent = 'Tampilkan'; // Ubah teks tombol menjadi 'Tampilkan'
            }
        });
    });

    updateOrderMethodCost();
}

//------------------------------------------------------------------------------------------------------------

function updateTotal(event)
{
    if (event.target.classList.contains('quantity'))
    {
        var menuDiv = event.target.closest('.menu');
        var totalDiv = menuDiv.nextElementSibling; // Select total div based on day index

        var total = 0;
        var items = menuDiv.querySelectorAll('.quantity');
        items.forEach(function (item)
        {
            var quantityValue = parseInt(item.value);
            if (isNaN(quantityValue) || quantityValue < 0)
            {
                quantityValue = 0; // Mengatasi kasus jika value adalah NaN atau negatif
            }

            total += parseFloat(item.getAttribute('data-price')) * quantityValue;
        });

        totalDiv.textContent = 'Total: Rp' + total;


    }

    // Update overall total
    var overallTotal = 0;
    var overallItems = document.querySelectorAll('.menu .quantity');
    overallItems.forEach(function (item)
    {
        var quantityValue = parseInt(item.value);
        if (isNaN(quantityValue) || quantityValue < 0)
        {
            quantityValue = 0; // Mengatasi kasus jika value adalah NaN atau negatif
        }
        overallTotal += parseFloat(item.getAttribute('data-price')) * quantityValue;
    });
    document.querySelector('.overall-total').textContent = 'Total Seluruh Hari: Rp' + overallTotal;
    calculateTotalAmount()

    updateOrderMethodCost();
}

function getMenuForDay(day)
{
    // Define menu for each day
    var menus = [
        [ // Sunday (0)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur sumsum sapi + wortel', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur sumsum sapi + wortel', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur hati ayam kampung + bayam', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur hati ayam kampung + bayam', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim sumsum sapi', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim sumsum sapi', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ikan dory', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },

            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },
            

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 60000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling 5 butir', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Monday (1)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ikan salmon + tomat', price: 5500, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur ikan salmon + tomat', price: 11000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur labu + keju', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur labu + keju', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim ayam kampung', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim ayam kampung', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ayam kampung', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },
            
            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 60000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Tuesday (2)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur beras merah + hati ayam kampung + kacang merah', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur beras merah + hati ayam kampung + kacang merah', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur daging sapi + ubi ungu', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur daging sapi + ubi ungu', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim daging sapi', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim daging sapi', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ikan salmon', price: 21000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },
            
            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 60000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Wednesday (3) Rabu
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ayam kampung + wortel', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur ayam kampung + wortel', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur kurma + buah bit', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur kurma + buah bit', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim ikan salmon', price: 6000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim ikan salmon', price: 12000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup daging sapi', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },

            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 60000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Thursday (4)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ikan dory + tomat', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur ikan dory + tomat', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur jagung + keju', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur jagung + keju', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim ikan dory', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim ikan dory', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ikan salmon', price: 21000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },

            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 60000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Friday (5)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur beras hitam + hati ayam kampung + kacang merah', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur beras hitam + hati ayam kampung + kacang merah', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur daging sapi + kacang polong', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur daging sapi + kacang polong', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim hati ayam kampung', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim hati ayam kampung', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ikan dory', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },

            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 60000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Saturday (6)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ikan surung + tomat', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur ikan surung + tomat', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ayam kampung + brokoli', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur ayam kampung + brokoli', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim ikan kakap', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim ikan kakap', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup daging sapi', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },
            
            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 60000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ]
    ];

    // Return menu for the specified day
    return menus[day];
}

function getMenuForDayTemporaryOne(day)
{
    // Define menu for each day
    var menus = [
        [ // Sunday (0)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur sumsum sapi + wortel', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur sumsum sapi + wortel', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur hati ayam kampung + bayam', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur hati ayam kampung + bayam', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim sumsum sapi', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim sumsum sapi', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ikan dory', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },

            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },
            

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 66000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling 5 butir', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Monday (1)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ikan salmon + tomat', price: 5500, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur ikan salmon + tomat', price: 11000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur labu + keju', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur labu + keju', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim ayam kampung', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim ayam kampung', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ayam kampung', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },
            
            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 66000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Tuesday (2)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur beras merah + hati ayam kampung + kacang merah', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur beras merah + hati ayam kampung + kacang merah', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur daging sapi + ubi ungu', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur daging sapi + ubi ungu', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim daging sapi', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim daging sapi', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ikan salmon', price: 21000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },
            
            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 66000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Wednesday (3) Rabu
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ayam kampung + wortel', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur ayam kampung + wortel', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur kurma + buah bit', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur kurma + buah bit', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim ikan salmon', price: 6000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim ikan salmon', price: 12000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup daging sapi', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },

            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 66000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Thursday (4)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ikan dory + tomat', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur ikan dory + tomat', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur jagung + keju', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur jagung + keju', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim ikan dory', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim ikan dory', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ikan salmon', price: 21000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },

            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 66000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Friday (5)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur beras hitam + hati ayam kampung + kacang merah', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur beras hitam + hati ayam kampung + kacang merah', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur daging sapi + kacang polong', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur daging sapi + kacang polong', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim hati ayam kampung', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim hati ayam kampung', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ikan dory', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },

            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 66000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Saturday (6)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ikan surung + tomat', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur ikan surung + tomat', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ayam kampung + brokoli', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur ayam kampung + brokoli', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim ikan kakap', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim ikan kakap', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup daging sapi', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },
            
            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 66000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ]
    ];

    // Return menu for the specified day
    return menus[day];
}

function getMenuForDayTemporaryTwo(day)
{
    // Define menu for each day
    var menus = [
        [ // Sunday (0)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur sumsum sapi + wortel', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur sumsum sapi + wortel', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur hati ayam kampung + bayam', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur hati ayam kampung + bayam', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim sumsum sapi', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim sumsum sapi', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ikan dory', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },

            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },
            

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 66000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling 5 butir', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Monday (1)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ikan salmon + tomat', price: 6000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur ikan salmon + tomat', price: 12000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur labu + keju', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur labu + keju', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim ayam kampung', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim ayam kampung', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ayam kampung', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },
            
            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 66000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Tuesday (2)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur beras merah + hati ayam kampung + kacang merah', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur beras merah + hati ayam kampung + kacang merah', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur daging sapi + ubi ungu', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur daging sapi + ubi ungu', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim daging sapi', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim daging sapi', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ikan salmon', price: 21000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },
            
            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 66000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Wednesday (3) Rabu
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ayam kampung + wortel', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur ayam kampung + wortel', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur kurma + buah bit', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur kurma + buah bit', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim ikan salmon', price: 6000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim ikan salmon', price: 12000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup daging sapi', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },

            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 66000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Thursday (4)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ikan dory + tomat', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur ikan dory + tomat', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur jagung + keju', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur jagung + keju', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim ikan dory', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim ikan dory', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ikan salmon', price: 21000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },

            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 66000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Friday (5)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur beras hitam + hati ayam kampung + kacang merah', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur beras hitam + hati ayam kampung + kacang merah', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur daging sapi + kacang polong', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur daging sapi + kacang polong', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim hati ayam kampung', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim hati ayam kampung', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup ikan dory', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },

            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 66000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ],
        [ // Saturday (6)
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ikan surung + tomat', price: 3000, defaultQuantity: quantityBuburA_half },
            { name: '1 Bubur ikan surung + tomat', price: 6000, defaultQuantity: quantityBuburA_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Bubur ayam kampung + brokoli', price: 3000, defaultQuantity: quantityBuburB_half },
            { name: '1 Bubur ayam kampung + brokoli', price: 6000, defaultQuantity: quantityBuburB_1 },
            { name: '<sup>1</sup>&frasl;<sub>2</sub> Nasi tim ikan kakap', price: 3000, defaultQuantity: quantityNasiTim_half },
            { name: '1 Nasi tim ikan kakap', price: 6000, defaultQuantity: quantityNasiTim_1 },
            { name: 'Sup daging sapi', price: 9000, defaultQuantity: quantitySup },
            // { name: 'Jus buah', price: 5000, defaultQuantity: quantityJusBuah },

            { name: 'Paket bubur frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketBuburFrozen },
            { name: 'Bubur frozen 1 pcs', price: 3000, defaultQuantity: quantityBuburFrozen },
            { name: 'Bubur frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityBuburFrozenSalmon },
            
            { name: 'Paket nasi tim frozen (isi 10 pcs)', price: 30000, defaultQuantity: quantityPaketNasiTimFrozen },
            { name: 'Nasi tim frozen 1 pcs', price: 3000, defaultQuantity: quantityNasiTimFrozen },
            { name: 'Nasi tim frozen salmon 1 pcs', price: 6000, defaultQuantity: quantityNasiTimFrozenSalmon },

            { name: 'Lauk frozen tongseng ayam negeri', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen besengek ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen rica-rica ayam negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk Frozen gulai Ayam Negeri', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen oseng daun pepaya', price: 10000, defaultQuantity: 0 },
            { name: 'Lauk frozen tempe lombok ijo', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna asam pedas', price: 10000, defaultQuantity: 0 },
            // { name: 'Lauk frozen ikan tuna acar', price: 10000, defaultQuantity: 0 },

            { name: 'Galantin original', price: 10000, defaultQuantity: 0 },
            { name: 'Galantin pedas', price: 10000, defaultQuantity: 0 },
            { name: 'Risol mayo frozen 5 pcs', price: 15500, defaultQuantity: 0 },
            { name: 'Makaroni schottle frozen', price: 3000, defaultQuantity: 0 },
            { name: 'Paket makaroni schottle frozen (isi 10 pcs)', price: 30000, defaultQuantity: 0 },

            { name: 'Kuah', price: 2000, defaultQuantity: 0 },

            { name: 'Kaldu ayam kampung', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu daging sapi', price: 3000, defaultQuantity: 0 },
            // { name: 'Kaldu ikan tuna', price: 3000, defaultQuantity: 0 },
            { name: 'Kaldu ikan salmon', price: 4000, defaultQuantity: 0 },
            { name: 'Kaldu ikan kakap', price: 4000, defaultQuantity: 0 },
            { name: 'Ikan salmon 100 gram', price: 66000, defaultQuantity: 0 },
            { name: 'Ikan dory 100 gram', price: 12000, defaultQuantity: 0 },
            { name: 'Ikan shisamo premium', price: 60000, defaultQuantity: 0 },
            { name: 'Daging Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Giling 5 butir', price: 15000, defaultQuantity: 0 },
            { name: 'Ayam Kampung Utuh', price: 55000, defaultQuantity: 0 },
            { name: 'Ayam negeri giling', price: 7500, defaultQuantity: 0 },
            
            { name: 'Ayam Negri Fillet 100 gram', price: 10000, defaultQuantity: 0 },
            { name: 'Hati ampela ayam kampung', price: 10000, defaultQuantity: 0 },
            //{ name: 'Kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            //{ name: 'Ceker ayam kampung 10 pcs', price: 5000, defaultQuantity: 0 },
            // { name: 'Ceker dan kepala ayam kampung 5 pcs', price: 5000, defaultQuantity: 0 },
            { name: 'Beef Slice 200 gram', price: 40000, defaultQuantity: 0 },
            // { name: 'Madu', price: 75000, defaultQuantity: 0 },

            { name: 'Beras Putih Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Merah Organik', price: 25000, defaultQuantity: 0 },
            { name: 'Beras Hitam Organik', price: 35000, defaultQuantity: 0 },

            { name: 'Saringan', price: 10000, defaultQuantity: 0 },
            { name: 'Sterofoam', price: 10000, defaultQuantity: 0 },
            { name: 'Sendok anti GTM', price: 35000, defaultQuantity: 0 },
        ]
    ];

    // Return menu for the specified day
    return menus[day];
}


function getDayName(day)
{
    var days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[day];
}

function getMonthName(month)
{
    var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months[month]
}

//--------------------------------------------------------------------------------------------------------------------


function getTotalDaysWithQuantity()
{
    var overallItems = document.querySelectorAll('.menu .quantity');
    var daysWithQuantity = new Set();

    overallItems.forEach(function (item)
    {
        var quantity = parseInt(item.value);
        if (quantity > 0)
        {
            var dayIndex = item.closest('.menu').nextElementSibling.dataset.day;
            daysWithQuantity.add(dayIndex);
        }
    });

    return daysWithQuantity.size;
}

function calculateOrderMethodCost(totalDays)
{
    if (totalDays < 7)
    {
        return 2000 * totalDays;
    } else if (totalDays < 30)
    {
        return 1500 * totalDays;
    } else
    {
        return 1000 * totalDays;
    }
}

function displayOrderFee(selectedDate)
{
    var orderSectionDiv = document.getElementById('orderMethod');
    var codOption = packet === '1' ? '<option value="cod">Delivery COD</option>' : '';

    orderSectionDiv.innerHTML = `
        <select id="orderMethod">
            <option value="">Pilih Metode Pemesanan</option>
            <option value="outlet">Outlet</option>
            <option value="delivery-transfer">Delivery Transfer</option>
            <option value="delivery-luar-jangkauan">Delivery Luar Jangkauan (DIY)</option>
            <option value="delivery-luar-kota">Delivery Luar Kota (Paxel)</option>
            ${codOption}
        </select>
        
        <p id="order-cost">Pilih metode pemesanan</p>
    `;
}


// Fungsi untuk menghitung biaya metode pemesanan
function updateOrderMethodCost()
{
    var method = document.getElementById('orderMethod').value;
    var totalDays = getTotalDaysWithQuantity();
    var orderMethodCost = 0;

    if (method === 'delivery-transfer' || method === 'cod')
    {
        if (totalDays < 7)
        {
            orderMethodCost = 3000 * totalDays;
            document.getElementById('order-cost').textContent = 'Biaya Ongkir: Rp3000 x ' + totalDays + ' = Rp' + orderMethodCost;
        } else if (totalDays < 30)
        {
            orderMethodCost = 2000 * totalDays;
            document.getElementById('order-cost').textContent = 'Biaya Ongkir: Rp2000 x ' + totalDays + ' = Rp' + orderMethodCost;
        } else 
        {
            orderMethodCost = 1000 * totalDays;
            document.getElementById('order-cost').textContent = 'Biaya Ongkir: Rp1000 x ' + totalDays + ' = Rp' + orderMethodCost;
        }
    } else if (method === 'outlet')
    {
        orderMethodCost = 0;
        document.getElementById('order-cost').textContent = 'Biaya Ongkir: Rp0 x ' + totalDays + ' = Rp' + orderMethodCost;
    } else if (method === 'delivery-luar-jangkauan')
    {
        orderMethodCost = 10000 * totalDays;
        document.getElementById('order-cost').textContent = 'Biaya Ongkir: Rp10000 x ' + totalDays + ' = Rp' + orderMethodCost;
    }
    else if (method === 'delivery-luar-kota')
    {
        orderMethodCost = " Biaya ongkir";
        document.getElementById('order-cost').textContent = orderMethodCost + ' akan ditentukan oleh admin';
    }
    else if (method === '')
    {
        orderMethodCost = 0;
        document.getElementById('order-cost').textContent = 'Pilih metode pemesanan';
    }

    calculateTotalAmount(orderMethodCost);


    return orderMethodCost

}

// Panggil fungsi saat dokumen diinisialisasi
document.addEventListener('DOMContentLoaded', function ()
{
    displayOrderFee();
    var orderForm = document.getElementById('orderMethod');
    if (orderForm)
    {
        orderForm.addEventListener('change', function (event)
        {
            updateOrderMethodCost(); // Panggil fungsi untuk memperbarui biaya metode pemesanan saat terjadi perubahan dalam metode pemesanan
        });

        var quantityInputs = document.querySelectorAll('.menu .quantity');
        quantityInputs.forEach(function (input)
        {
            input.addEventListener('input', function ()
            {
                updateOrderMethodCost(); // Panggil fungsi untuk memperbarui biaya metode pemesanan saat terjadi perubahan dalam input kuantitas
            });
        });
    } else
    {
        console.error("Elemen dengan ID 'orderMethod' tidak ditemukan.");
    }
});

function calculateTotalAmount(finalTotal)
{
    // Temukan elemen dengan kelas 'overall-total'
    var overallTotalElement = document.querySelector('.overall-total');
    var overallTotal = 0; // default value

    // Periksa apakah elemen ditemukan
    if (overallTotalElement)
    {
        // Ambil nilai 'textContent'
        var overallTotalText = overallTotalElement.textContent;

        // Pisahkan string untuk mendapatkan nilai overallTotal
        var overallTotalMatch = overallTotalText.match(/Rp(\d+(\.\d+)*)/);

        // cek apakah pola sesuai
        if (overallTotalMatch && overallTotalMatch[1])
        {
            overallTotal = parseFloat(overallTotalMatch[1]);
        }
    } else
    {
        console.error("Elemen '.overall-total' tidak ditemukan.");
    }

    // output nilai overallTotal dan finalTotal


    // Jumlahkan kedua variabel
    var totalAmount = overallTotal + finalTotal;
    console.log(typeof(totalAmount))

    // output nilai totalAmoun
    var finalMethodElement = document.getElementById('finalMethod');
    if (finalMethodElement)
    {
        if(typeof(totalAmount) === "number")
        finalMethodElement.textContent = "Total Biaya Pemesanan: Rp" + totalAmount;
        else
        finalMethodElement.textContent = "Total Biaya Pemesanan: Rp" + overallTotal + " + Biaya ongkir";
    } else
    {
        console.error("Elemen '#finalMethod' tidak ditemukan.");
    }
}

var orderMethodSelect = document.getElementById('orderMethod');
var outletInfoDiv = document.getElementById('outlet-info');
var outletOptionSelect = document.getElementById('outletOption');

orderMethodSelect.addEventListener('change', function ()
{
    var selectedValue = this.value;
    if (selectedValue === 'outlet')
    {
        outletInfoDiv.style.display = 'block';
    } else
    {
        outletInfoDiv.style.display = 'none';
    }
});
