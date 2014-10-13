//////////////////// ADD-OVERLAY ////////////////////////////////////////////
Polymer('add-overlay', {
  selected: "dhl",
  label: '',
  uid: '',
  headericon: "assets/dhl.jpg",
  created: function() {
    this.addEventListener("keypress", function() {
    if (event.keyCode == 13) console.log('enter');
    });
  }
  ,
  itemSelected: function(e, detail) {
      this.headericon = 'assets/' + this.selected + '.jpg';
  },
  confirm: function() {
    this.fire('add', {uid: this.uid, service: this.selected, label: this.label});
    this.uid = '';
    this.label = '';
    this.selected = 'dhl';
  },
  keypressHandler: function(event, detail, sender) {
      if(event.keyCode==13 || event.keyCode==19){
        this.confirm();
        this.opened=false;
        }
  },
  open: function() {
    this.opened = true;
    console.log(this.$);

  },
  uidChanged: function() {
    //if (this.uid.length <= 12) this.selected = 'dhl';
    if (this.uid.length > 12) this.selected = 'hermes';
  }
});

//////////////////// DETAIL-OVERLAY ////////////////////////////////////////////
Polymer('detail-overlay', {
  open: function(uid) {
    this.toggle();
    detailSetParcel(this, uid);
  }
});

function detailSetParcel(detailCard, uid) {
  chrome.storage.sync.get(uid, function(p) {
    detailCard.parcel = p[uid];
  });
}

//////////////////// DHL-LIST ////////////////////////////////////////////
(function() {
Polymer('dhl-list', {
  showChanged: function() {
    updateList(this, this.show);
  },
  created: function() {
    updateList(this, this.show);
  },
  update: function() {
    updateList(this, this.show);
  },
  updateItem: function(p) {
    this.fire('update', {parcel: p});
  }
});

function updateList(list, show) {
  switch (show) {
    case 'all': getAllPackages(list); break;
    case 'received': getReceivedPackages(list); break;
    case 'underway': getUnderwayPackages(list); break;
  }
}

function getAllPackages(list) {
    chrome.storage.sync.get(null, function(p) {
      var num_array = new Array();
      for (var items in p){
        num_array.push(p[items]);
      }
      list.packages = num_array.sort(compare);
    });
}

function getReceivedPackages(list) {
    chrome.storage.sync.get(null, function(p) {
      var num_array = new Array();
      for (var items in p){
        if (p[items]['delivered']) num_array.push(p[items]);
      }
      list.packages = num_array.sort(compare);
    });
}

function getUnderwayPackages(list) {
    chrome.storage.sync.get(null, function(p) {
      var num_array = new Array();
      for (var items in p){
        if (!p[items]['delivered']) num_array.push(p[items]);
      }
      list.packages = num_array.sort(compare);
    });
  }

function compare(a,b) {
  if (a['timeAdded'] < b['timeAdded'])
     return -1;
  if (a['timeAdded'] > b['timeAdded'])
    return 1;
  return 0;
}

  })
();

//////////////////// DHL-CARD ////////////////////////////////////////////
Polymer('dhl-card', {
  created: function(){
    //
    this.raise = 1;
  },
  domReady: function(){
    if (this.label == '') {
      this.querySelector('h2').innerHTML =
        'Package No.' + this.parcel['label'];
    }
  },
  onHover: function(){this.raise = 3;},
  onOut: function(){this.raise = 1;},
  downAction: function(e) {
    this.$.ripple.downAction({x: e.x, y: e.y});
  },
  upAction: function(e) {
    this.$.ripple.upAction();
  },
  packageClick: function(e, detail) {
    var detail_overlay = document.querySelector('detail-overlay');
    detail_overlay.open(this.parcel['piece_identifier']);
  },
  edit: function(e, detail) {
    var list = document.querySelector('dhl-list');
    list.fire('editParcel', {action: 'update', parcel: this.parcel});
  },
  refresh: function(e, detail) {
    var list = document.querySelector('dhl-list');
    list.fire('editParcel', {action: 'update', parcel: this.parcel});
  },
  clear: function(e, detail) {
    var list = document.querySelector('dhl-list');
    list.fire('editParcel', {action: 'delete',parcel: this.parcel});
  }
});
