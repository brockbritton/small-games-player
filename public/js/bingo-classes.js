
class CallerOrganizer {
    constructor() {
        this.caller = null;
        this.resetUIVisuals();
    }

    resetUIVisuals() {
        //reset the slider and checkboxes - so a new game cannot be accidentally created
        const slider = document.getElementById("slider-checkbox")
        if (slider.checked) {
            slider.checked = false
        }
        const checkboxes = document.getElementsByClassName("select-column-checkbox");
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                checkboxes[i].checked = false
            }
        }
        
        //clear the called number text
        let html_display = document.getElementById("html-call-display")
        html_display.innerHTML = "&#8203;"
        
        //reset the called numbers table
        const table_cells = document.getElementsByClassName("cell_number_class")
        for (let i = 0; i < table_cells.length; i++) {
            if (table_cells[i].classList.contains("cell_number_called")) {
                table_cells[i].classList.toggle("cell_number_called")
            }
        }
    }

    checkClick(event) {
        const slider = document.getElementById("slider-checkbox")
        if (slider.checked) {
            event = event || window.event;
            event.preventDefault()
        }
    }
    

    buildNewCaller() {
        const game_columns = this.collectColumns();
        if (game_columns.length > 0) {
            this.caller = new BingoCaller(game_columns)
        } else {
            alert("please select at least one column or toggle to all")
        }
        this.resetUIVisuals()
    
    }

    collectColumns() {
        const checkboxes = document.getElementsByClassName("select-column-checkbox");
        const slider = document.getElementById("slider-checkbox")
        if (slider.checked) {
            return [0, 1, 2, 3, 4];
        } else {
            let values = []; 
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    values.push(Number(checkboxes[i].value))
                }
            }
            return values
        }
    }

    checkCallNumber() {
        if (this.caller != null) {
            this.caller.callNumber()
        } else {
            alert("please start a new caller game first")
            let html_display = document.getElementById("html-call-display")
            html_display.innerHTML = "&#8203;" 
        }
    }

    toggleColumnsSelect() {
        const slider = document.getElementById("slider-checkbox")
        const checkboxes = document.getElementsByClassName("select-column-checkbox");
        for (let i = 0; i < checkboxes.length; i++) {
            if (slider.checked) {
                checkboxes[i].checked = true;
            } else {
                checkboxes[i].checked = false;
            }
        }
    }
}

class BingoCaller {
    constructor(column_values) {
        this.finished = false;
        this.past_calls = [];
        this.buildCallPool(column_values)
    }

    
    buildCallPool(columns) {
        this.call_pool = []
        for (let i = 0; i < columns.length; i++) {
            let start = columns[i] * 15
            for (let n = 1; n <= 15; n++) {
                this.call_pool.push(start + n)
            }
        }
    }

    callNumber() {
        if (this.call_pool.length > 0) {
            let random_index = Math.floor(Math.random() * (this.call_pool.length));
            let called_num = this.call_pool[random_index]
            this.call_pool.splice(random_index, 1)
            this.past_calls.push(called_num)

            let table_cell = document.getElementById(`cell${called_num}`)
            table_cell.classList.toggle("cell_number_called")

            const letters = ["B", "I", "N", "G", "O"]
            let html_display = document.getElementById("html-call-display")
            html_display.innerHTML = `${letters[Math.floor(called_num / 15.1)]} ${called_num}`
        } else {
            alert("all numbers for this game have been called")
            let html_display = document.getElementById("html-call-display")
            html_display.innerHTML = "&#8203;"
        }
    }
}

class PlayerOrganizer {
    constructor() {
        this.current_boards = []
        this.call_list = []
        this.updateBoardsNum() //this.boards_num
        this.updateHighlightColor() //this.highlight_color 
        this.updateWinningPattern() //this.winning_pattern 
        //also need to update / clear old game visuals

    }

    getDropdownValue(id) {
        let dropdown = document.getElementById(id)
        return dropdown.value
    }

    updateBoardsNum() {
        this.boards_num = Number(this.getDropdownValue("boards-num-dropdown"))
    }

    updateHighlightColor() {
        let colorpicker = document.getElementById("highlight-colorpicker")
        this.changeCSSStyle(".custom-board-cell-highlight", "background-color", colorpicker.value)
        this.highlight_color = colorpicker.value
    }

    updateWinningPattern() {
        let value = this.getDropdownValue("winning-pattern-dropdown")
        this.winning_pattern = value

        let content = document.getElementById("create-custom-winning-pattern-div")
        let other_select = document.getElementById("other-select")
        if (other_select.selected) {
            content.style.maxHeight = "300px";
        } else {
            content.style.maxHeight = "0px";
            
        }
    }

    clearDivByID(id) {
        let div_to_clear = document.getElementById(id)
        while (div_to_clear.firstChild) {
            div_to_clear.removeChild(div_to_clear.firstChild);
        }
    }

    changeCSSStyle(selector, cssProp, cssVal) {
        // 1 = second listed external stylesheet: bingo-style.css
        for ( let i=0, len =document.styleSheets[1]['cssRules'].length; i<len; i++) {
            if (document.styleSheets[1]['cssRules'][i].selectorText === selector) {
                document.styleSheets[1]['cssRules'][i].style[cssProp] = cssVal;
                return;
            }
        }
    }

    hexToRGB(hex_code) {
        if (hex_code.length == 7) {
            hex_code = hex_code.substring(1)
        } 
        let rgbHex = hex_code.match(/.{1,2}/g);
        let rgb_array = [
            parseInt(rgbHex[0], 16),
           parseInt(rgbHex[1], 16),
            parseInt(rgbHex[2], 16)
        ];
        return rgb_array
    }

    numberCellClicked(element) {
        let num = parseInt(element.innerHTML);
        element.classList.toggle("font-weight-900")
        if (!this.call_list.includes(num)) {
            this.call_list.push(num);
            for (let i = 0; i < this.current_boards.length; i++) {
                this.current_boards[i].callNumber(num)
            }  
        } else {
            let num_index = this.call_list.indexOf(num)
            this.call_list.splice(num_index)
            for (let i = 0; i < this.current_boards.length; i++) {
                this.current_boards[i].uncallNumber(num)
            }
        }

        //look for bingo in current boards
        //if found, update the custom bingo alert
        this.evaluateBingoCalls()
        
    }

    evaluateBingoCalls() {
        let first_bingo_boards = []
        let old_bingo_boards = []
        for (let i = 0; i < this.current_boards.length; i++) {
            if (this.current_boards[i].bingo_win) {
                if (this.current_boards[i].first_bingo_call) {
                    first_bingo_boards.push(this.current_boards[i])
                    this.current_boards[i].first_bingo_call = false
                } else {
                    old_bingo_boards.push(this.current_boards[i])
                }
            }
        }

        if (first_bingo_boards.length > 0) {
            let first_bingo_nums = this.buildBoardsNumPhrase(first_bingo_boards)
            document.getElementById("alert-new-nums").innerHTML = first_bingo_nums
            if (old_bingo_boards.length > 0) {
                let old_bingo_nums = this.buildBoardsNumPhrase(old_bingo_boards)
                document.getElementById("alert-old-nums").innerHTML = old_bingo_nums
            } else {
                document.getElementById("alert-old-nums").innerHTML = "none"
            }
            this.toggleBingoAlert()
        }
    }

    toggleBingoAlert() {
        const bingo_popup = document.getElementById("bingo-alert-popup-display")
        const blur_div = document.getElementById("numbers-table-container")
        if (bingo_popup.style.zIndex == 1) {
            //change popup to visible and blur
            blur_div.style.filter = blur("11px")
            bingo_popup.style.zIndex = 3
        } else {
            //hide popup and unblur
            blur_div.style.filter = "none"
            bingo_popup.style.zIndex = 1
        }
    
    }

    buildBoardsNumPhrase(boards_array) {
        if (boards_array.length == 0) {
            return false
        } else if (boards_array.length == 1) {
            return boards_array[0].board_num
        } else if (boards_array.length == 2) {
            return `${boards_array[0].board_num} & ${boards_array[1].board_num}`
        } else {
            let phrase = ""
            for (let i = 0; i < boards_array.length - 1; i++) {
                phrase += ` ${boards_array[i].board_num},`
            }  
            phrase += ` & ${boards_array[boards_array.length - 1].board_num}`
            return phrase
        } 
    }

    collectCustomWinningPattern() {
        let values = []
        let cells = document.getElementsByClassName("custom-wp-cells")
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].classList.contains("custom-board-cell-highlight")) {
                values.push(true)
            } else {
                values.push(false)
            }
        }
        return values 
    }

    buildNewPlayer() {
        //delete old bingo boards
        this.clearDivByID("play-boards-div")

        //collect and analyze the custom pattern
        let custom_wp_container = document.getElementById("create-custom-winning-pattern-div")
        let custom_wp_array = null
        if (custom_wp_container.style.maxHeight != "0px") {
            //get the custom winning pattern
            custom_wp_array = this.collectCustomWinningPattern()
            let selected_count = 0
            for (let i = 0; i < custom_wp_array.length; i++) {
                if (custom_wp_array[i]) {
                    selected_count += 1
                }
            }
            //if there are no selected cells for the pattern
            if (selected_count == 0) {
                alert("please select at least one cell for your custom pattern")
                return false
            } else if (selected_count == 1) {
                let check_for_center = this.collectCustomWinningPattern()
                check_for_center.splice(Math.floor(check_for_center.length / 2))
                if (!check_for_center.includes(true)) {
                    alert("please choose more than just the free space")
                    return false
                }
            }

            //fill in the display for the winning pattern
            let display_cells = document.getElementsByClassName("wp-display-cells")
            for (let i = 0; i < display_cells.length; i++) {
                if (custom_wp_array[i]) {
                    display_cells[i].classList.add("bingo-cell-called-highlight")
                } else {
                    display_cells[i].classList.remove("bingo-cell-called-highlight")
                }

            }
            //hide and clear custom wp board
            custom_wp_container.style.maxHeight = "0px";
            let custom_wp_cells = document.getElementsByClassName("custom-wp-cells")
            for (let i = 0; i < custom_wp_cells.length; i++) {
                if (custom_wp_cells[i].classList.contains("custom-board-cell-highlight")) {
                    custom_wp_cells[i].classList.toggle("custom-board-cell-highlight")
                }   
            }
        }

        //update highlight color for called bingo card cells
        this.changeCSSStyle(".bingo-cell-called-highlight", "background-color", this.highlight_color)

        //update highlight color for called table of numbers
        let rgb_array = this.hexToRGB(this.highlight_color);
        this.changeCSSStyle(".bingo-cell-called-transparent-highlight", "background-color", `rgba(${rgb_array[0]}, ${rgb_array[1]}, ${rgb_array[2]}, 0.2)`)
        
        //clear called nums list and reset called nums table style
        this.call_list = []
        this.current_boards = []

        //update current game label, display label
        let game_type_label = document.getElementById("curr-game-label")
        if (custom_wp_array == null) {
            game_type_label.innerHTML = "Current Game: Classic"
        } else {
            game_type_label.innerHTML = "Current Game: Pattern Match"
        }
        game_type_label.style.display = "block"

        //hide the bingo popup if necessary -- maybe also need to delete the blur?
        let bingo_popup = document.getElementById("bingo-alert-popup-display")
        bingo_popup.style.zIndex = 1

        //clear and display (or re-display) recording numbers option
        let called_table_cells = document.getElementsByClassName("horizontal-table-cell") 
        for (let i = 0; i < called_table_cells.length; i++) {
            if (called_table_cells[i].classList.contains("font-weight-900")) {
                called_table_cells[i].classList.toggle("font-weight-900")
            }
        }
        let select_div = document.getElementById("bingo-play-control-box")
        select_div.style.display = "block"
        
        //build the rows for the board visuals
        const boards_per_row = 4
        const boards_div = document.getElementById("play-boards-div")
        for (let i = 0; i < Math.ceil(this.boards_num / boards_per_row); i++) {
            const boards_row = document.createElement("div")
            boards_row.classList.add("play-boards-row")
            boards_div.appendChild(boards_row)
        }

        //build the bingo boards from Classes
        //also display pattern match display or classic win paragraph
        let classic_par = document.getElementById("classic-win-par")
        let wp_display = document.getElementById("custom_wp_display")
        for (let i = 0; i < this.boards_num; i++) {
            if (custom_wp_array == null) {
                this.current_boards.push(new ClassicBingoBoard(i))
                classic_par.style.display = "block"
                wp_display.style.display = "none"

            } else {
                this.current_boards.push(new PatternMatchBingoBoard(i, custom_wp_array))
                classic_par.style.display = "none"
                wp_display.style.display = "block"
            }
        }
        //reset dropdowns
        let default_options = document.getElementsByClassName("default-dropdown-option")
        for (let i = 0; i < default_options.length; i++) {
            default_options[i].selected = true
        }
    }


}

class BingoBoard {
    constructor(id) {
        this.id_num = id
        this.board_num = id + 1
        this.all_nums = []
        this.columns = this.createNumberColumns()
        this.rows = this.buildRows()
        this.curr_bool_pattern = this.buildStartingBoolPattern()
        this.calls_for_bingo = 5
        this.bingo_win = false
        this.first_bingo_call = true
        this.buildBingoBoardVisual()
    }

    genRandomNumber(col_iter) {
        return (15 * col_iter) + Math.floor(Math.random() * 15) + 1
    }

    createNumberColumns() {
        const columns = []
        for (let i = 0; i < 5; i++) {
            columns.push([])
            while (columns[i].length < 5) {
                let random_num = this.genRandomNumber(i)
                while (columns[i].indexOf(random_num) != -1) {
                    random_num = this.genRandomNumber(i)
                    
                }
                columns[i].push(random_num)
            }
        }
        //designate the free space
        columns[2][2] = "FREE"
        return columns
    }

    buildRows() {
        let rows = [] 
        for (let i = 0; i < 5; i++) {
            let row = []
            for (let j = 0; j < 5; j++) {
                row.push(this.columns[j][i])
                this.all_nums.push(this.columns[j][i])
            }
            rows.push(row)
        }
        return rows
    }

    buildBingoBoardVisual() {
        const board_border = document.createElement("div")
        board_border.classList.add("board-border", "side-by-side")
    
        const table_container = document.createElement("div")
        table_container.classList.add("board-table")
        table_container.setAttribute("id", `cells-container-board-${this.id_num}`)
    
        const header_letters = ["B", "I", "N", "G", "O"]
        const header_row = document.createElement("div")
        header_row.classList.add("board-row")
        for (let i = 0; i < header_letters.length; i++) {
            let header_cell = document.createElement("div")
            header_cell.classList.add("board-header", "side-by-side")
            header_cell.innerHTML = header_letters[i]
            header_row.appendChild(header_cell)
        }
        table_container.appendChild(header_row)
    
        for (let i = 0; i < header_letters.length; i++) {
            let board_row = document.createElement("div")
            board_row.classList.add("board-row")
            for (let j = 0; j < header_letters.length; j++) {
                let board_cell = document.createElement("div")
                let cell_text = document.createElement("p")
                
                if (i == 2 && j == 2) {
                    board_cell.classList.add("board-cell", "side-by-side", "bingo-cell-called-highlight")
                    cell_text.classList.add("board-cell-text-sizing", "board-free-cell-text")
                } else {
                    board_cell.classList.add("board-cell", "side-by-side", "numbers-font")
                    cell_text.classList.add("board-cell-text-sizing")
                }
                cell_text.innerHTML = `${this.rows[i][j]}`    
                board_cell.appendChild(cell_text)
                board_row.appendChild(board_cell)
                
            }
            table_container.appendChild(board_row)
    
        }
        board_border.appendChild(table_container)
        //label with board number
        let board_num_label = document.createElement("p")
        board_num_label.classList.add("board_id_label")
        board_num_label.innerText = `Board ${this.id_num + 1}`
        board_border.appendChild(board_num_label)


        const board_rows = document.getElementById("play-boards-div").children
        
        if (board_rows[0].children.length < 4) {
            board_rows[0].appendChild(board_border)
        } else {
            board_rows[1].appendChild(board_border)
        }
    }

    collectCellsNumInPattern(pattern) {
        //count the true values in a pattern
        let count = 0
        for (let i = 0; i < pattern.length; i++) {
            if (pattern.length[i]) {
                count += 1
            }
        }
        return count
    }

    callNumber(num) {
        let table_divs_container = document.getElementById(`cells-container-board-${this.id_num}`)
        let num_index = this.all_nums.indexOf(num)
        if (num_index != -1) {
            this.curr_bool_pattern[num_index] = true
            let called_cell = table_divs_container.children[Math.floor(num_index / 5)+1].children[num_index % 5]
            called_cell.classList.add("bingo-cell-called-highlight")
            this.bingo_win = this.checkWin()
            /*
            if (this.collectCellsNumInPattern(this.curr_bool_pattern) >= this.calls_for_bingo) {
                this.bingo_win = this.checkWin()
            }
            */
        }
        
    }

    uncallNumber(num) {
        let table_divs_container = document.getElementById(`cells-container-board-${this.id_num}`)
        let num_index = this.all_nums.indexOf(num)
        if (num_index != -1) {
            this.curr_bool_pattern[num_index] = false
            let called_cell = table_divs_container.children[Math.floor(num_index / 5)+1].children[num_index % 5]
            called_cell.classList.remove("bingo-cell-called-highlight")
            //if deciding bingo call is misclicked, bingo is removed
            let win_bool = this.checkWin()
            this.bingo_win = win_bool
            this.first_bingo_call = !win_bool
        }
    }

    buildStartingBoolPattern() {
        const bool_pattern = []
        for (let i = 0; i < 25; i++) {
            if (i != Math.floor(25/2)) {
                bool_pattern.push(false) 
            } else {
                bool_pattern.push(true)
            } 
        } 
        return bool_pattern
    }

}

class PatternMatchBingoBoard extends BingoBoard {
    constructor(id, pattern) {
        super(id)
        this.win_bool_pattern = pattern
        this.checkFreeSpaceHighlight()
        this.calls_for_bingo = this.collectCellsNumInPattern(pattern)
    }



    checkFreeSpaceHighlight() {
        let table_divs_container = document.getElementById(`cells-container-board-${this.id_num}`)
        let free_index = this.all_nums.indexOf('FREE')
        let free_cell = table_divs_container.children[Math.floor(free_index / 5)+1].children[free_index % 5]
        if (!this.win_bool_pattern[free_index]) {
            free_cell.classList.add("bingo-cell-called-transparent-highlight")
            free_cell.classList.remove("bingo-cell-called-highlight")
        }
    }

    callNumber(num) {
        let table_divs_container = document.getElementById(`cells-container-board-${this.id_num}`)
        let num_index = this.all_nums.indexOf(num)
        if (num_index != -1) {
            this.curr_bool_pattern[num_index] = true
            let called_cell = table_divs_container.children[Math.floor(num_index / 5)+1].children[num_index % 5]
            if (this.win_bool_pattern[num_index]) {
                called_cell.classList.add("bingo-cell-called-highlight")
            } else {
                called_cell.classList.add("bingo-cell-called-transparent-highlight")
            }

            if (this.collectCellsNumInPattern(this.curr_bool_pattern) >= this.calls_for_bingo) {
                this.bingo_win = this.checkWin()
            }
        }
    }

    uncallNumber(num) {
        let table_divs_container = document.getElementById(`cells-container-board-${this.id_num}`)
        let num_index = this.all_nums.indexOf(num)
        if (num_index != -1) {
            this.curr_bool_pattern[num_index] = false
            let called_cell = table_divs_container.children[Math.floor(num_index / 5)+1].children[num_index % 5]
            if (this.win_bool_pattern[num_index]) {
                called_cell.classList.remove("bingo-cell-called-highlight")
            } else {
                called_cell.classList.remove("bingo-cell-called-transparent-highlight")
            }

            //if deciding bingo call is misclicked, bingo is removed
            let win_bool = this.checkWin()
            this.bingo_win = win_bool
            this.first_bingo_call = !win_bool
        }
    }

    checkWin() {
        //check current boolean board against bool winning pattern
        //current board can have more trues, but needs the right ones in the right place
        //return true if win, else return false
        for (let i = 0; i < this.win_bool_pattern.length; i++) {
            if (this.win_bool_pattern[i]) {
                if (!this.curr_bool_pattern[i]) {
                    return false
                }
            }
        }
        return true

    }



}

class ClassicBingoBoard extends BingoBoard {
    constructor(id) {
        super (id)
        this.calls_before_bingo = 4
        //this.LRDown = this.buildLRDown()
        //this.LRUp = this.buildLRUp()
    }

    checkWin() {
        //check diagonals
        let LRUp_array = []
        let LRDown_array = []
        for (let i = 0, j = 4; i < 5; i++, j--) {
            LRUp_array.push(this.curr_bool_pattern[(j*5)+i])  
            LRDown_array.push(this.curr_bool_pattern[(i*5)+i]) 
        }
        if (!LRUp_array.includes(false) || !LRDown_array.includes(false)) {
            return true
        }

        //check across and down
        for (let i = 0; i < 5; i++) {
            let across_array = []
            let down_array = []
            for (let j = 0; j < 5; j++) {
                across_array.push(this.curr_bool_pattern[(i*5)+j])
                down_array.push(this.curr_bool_pattern[(j*5)+i])
            }
            if (!across_array.includes(false) || !down_array.includes(false)) {
                return true
            }
        }

        return false
        
    }
}