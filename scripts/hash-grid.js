(function(BroadPhase, BruteForce) {
  /**
   * Implements the space partitioning algorithim for better performance.
   * @see http://en.wikipedia.org/wiki/Space_partitioning
   * @class HashGrid
   */
  function HashGrid(width, height, cellWidth, cellHeight) {
    this.width = width;
    this.height = height;

    this.cellWidth = cellWidth || this.width / 10;
    this.cellHeight = cellHeight || this.height / 10;

    this.rows = Math.ceil(this.height / this.cellHeight);
    this.cols = Math.ceil(this.width / this.cellWidth);

    // We will need to use bruteforce check for each item inside a cell
    this.bruteForce = new BruteForce;

    this.grid = [];
  }

  /**
   * Cleans the partitioning grid.
   *
   * @method resetGrid
   * @private
   */
  HashGrid.prototype.resetGrid = function() {

    /*
    for (var y = 0; y < this.rows; y++) {
      if (!this.grid[y]) continue;
      for (var x = 0; x < this.cols; x++) {
        if (this.grid[y][x] instanceof Platform) {
          console.log("Platform");
          continue;
        } else {
          this.grid[y][x] = [];
        }
      }
    }
    console.log(this.grid);
    */
    for (var y = 0; y < this.rows; y++) {
      if (!this.grid[y]) continue;
      this.grid[y].length = 0;
    }
  }

  /**
   * Checks for collision using spatial grid hashing.
   *
   * @method check
   * @param {Array} particles thie list of particles to check collisions.
   * @param {Function} comparator the function that, given two objects, return if they are
   *     colliding or not.
   * @param {Function} resolver the collision resolver which will receive each collision pair
   *     occurence.
   */
  var tilesBBLoaded = false;
  var counter = 0;
  HashGrid.prototype.check = function(particles) {
    var length = particles.length,
        collisions = [];

    this.resetGrid();

    counter = 0;
    for (var i = 0; i < length; i++) {
      var particle = particles[i];

      var pos = new Vector2D(particle.bb.getPos().x - particle.bb.getOrigin().x
          ,particle.bb.getPos().y - particle.bb.getOrigin().y);
      var extents = new Vector2D(particle.bb.getExtents().x / 2, particle.bb.getExtents().y / 2);

      var xMin = ((particle.x - extents.x) / this.cellWidth) << 0;
      var xMax = ((particle.x + extents.x * 2) / this.cellWidth) << 0;
      var yMin = ((particle.y - extents.y) / this.cellHeight) << 0;
      var yMax = ((particle.y + extents.y * 2) / this.cellHeight) << 0;

      //Insert entity into cell that it overlaps
      for (var y = yMin; y <= yMax; y++) {  //Loop through grid rows
        var row = this.grid[y];
        if (!row) row = this.grid[y] = [];

        for (var x = xMin; x <= xMax; x++) { //Loop through grid columns
          var col = row[x];
          if (!col) col = this.grid[y][x] = [];
          col.push(particle); //Add entity to cell
        }
      }

    }

    var colltests = 0;
    var hashChecks = 0;

    var entityA,
        entityB;
    var hashA,
        hashB;
    var pairs = [];
    var checked = {};

    //Loop through cell rows
    for (var y = 0; y < this.rows; y++) {
      var row = this.grid[y];
      if (!row) continue;

      //Loop through cell columns
      for (var x = 0; x < this.cols; x++) {
        var col = row[x];
        if (!col) continue;   //Ignore cells with no object

        //Loop every object in cell
        for (var k = 0; k < col.length; k++) {
          entityA = col[k];
          //Every other object in cell
          for (var l = k+1; l < col.length; l++) {
            entityB = col[l];

            if ((entityA instanceof Platform) && (entityB instanceof Platform)) {
              continue;
            }
            //Create key to mark pair
            hashA = entityA._roId + ':' + entityB._roId;
            hashB = entityB._roId + ':' + entityA._roId;
            hashChecks +=2;
            //console.log(hashA);

            if (!checked[hashA] && !checked[hashB]) {
              checked[hashA] = checked[hashB] = true;
              colltests++;
              if (entityA.bb.collision(entityB.bb)) {
                pairs.push([entityA,entityB]);
              }
            }
          }
        }
      }
    }
    //console.log(colltests);
    //console.log(hashChecks);

    tilesBBLoaded = true;
    //console.log(counter);
    return pairs;
  }

  BroadPhase.HashGrid = HashGrid;
})(window.BroadPhase, window.BroadPhase.BruteForce);
