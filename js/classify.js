class Search {
    min_row = 1;
    max_row = 8;
    total_rows = 0;
    current_row = 1;

    add = () => {
        var temp_max = 0;
        if(total_rows < max_row) {
            temp_max = total_rows;
            if (current_row < temp_max) {
                current_row++;
            }
        }
        else {
            if (current_row < max_row) {
                current_row++;
            }
        }
        document.getElementById('gallery').style.height = `calc((85px * ${current_row} - 5px)`;
    }

    sub = () => {
        if(current_row > min_row) { current_row--; }
        document.getElementById('gallery').style.height = `calc((85px * ${current_row} - 5px)`;
    }
    
    resize = () => {
        while(total_rows < current_row) { current_row--; }
        document.getElementById('gallery').style.height = `calc((85px * ${current_row} - 5px)`;
    }
    
    openresults = () => {
        document.getElementById('resize').style.display = 'flex';
        document.getElementById('gallery').style.display = 'flex';
        resize();
    }
    
    closeresults = () => {
        document.getElementById('resize').style.display = 'none';
        document.getElementById('gallery').style.display = 'none';
    }
    
    getTotalRows = (items) => {
        total_rows = Math.ceil(items / 8);
    }
}