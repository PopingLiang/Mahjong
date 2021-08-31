let posn = {
        "E": "東風",
        "S": "南風",
        "W": "西風",
        "N": "北風"
    }
    let pos = ["E", "S", "W", "N"]
    let scor = {
        "E": 0,
        "S": 0,
        "W": 0,
        "N": 0
    }
    let index = 1

    function caculate(bywho) {
        var opt = bywho == "E" ? "" : `<option value="E">東</option>`
        opt += bywho == "S" ? "" : `<option value="S">南</option>`
        opt += bywho == "W" ? "" : `<option value="W">西</option>`
        opt += bywho == "N" ? "" : `<option value="N">北</option>`
        console.log(opt)
        let bp = parseInt($("#base_point").val())
        let bop = parseInt($("#bonus_point").val())
        let banker = $("#pos").data("id")
        let bcount = 1 + parseInt($("#count").val()) * 2
        Swal.fire({
            title: "積分計算",
            html: `
            放槍：
            <select id="who" class="mb-3" name="who">
            <option value="self">自摸</option>
            ${opt}
            </select><br>
            台數：<input type="number" name="scoring" id="scoring" value="0" min="0"><br>
            <div>分數：<span id="talscr"></span></div>
           `,
            didOpen: () => {
                $("#scoring").on("change", () => {
                    $("#talscr").html(bp + (bop * $("#scoring").val()))
                })
            },
            preConfirm: () => {
                return {
                    who: $("#who").val(),
                    score: bp + (bop * $("#scoring").val())
                }
            }
        }).then((data) => {
            console.log(data)
            let fianlscore
            if (bywho == banker) {
                fianlscore = (data.value.score + (bop * bcount))
                if (data.value.who == "self") {
                    fianlscore += 10
                    for (let k in scor) {
                        if (k == bywho) {
                            scor[k] += fianlscore * 3
                        } else {
                            scor[k] -= fianlscore
                        }
                    }
                } else {
                    scor[bywho] += fianlscore
                    scor[data.value.who] -= fianlscore
                }
                $("#count").val(parseInt($("#count").val()) + 1)
            } else {
                fianlscore = data.value.score
                if (data.value.who == "self") {
                    fianlscore += 10
                    for (let k in scor) {
                        if (k == bywho) {
                            scor[k] += (fianlscore * 3) + (bop * bcount)
                        } else {
                            if (k == banker) {
                                scor[k] -= (fianlscore + (bop * bcount))
                            } else {
                                scor[k] -= fianlscore
                            }
                        }
                    }
                } else {
                    fianlscore += data.value.who == banker ? +(bop * bcount) : +0
                    scor[bywho] += fianlscore
                    scor[data.value.who] -= fianlscore
                }
                let newbanker = (parseInt($("#pos").data("k")) + 1) % 4
                $("#pos").html(posn[pos[newbanker]])
                $("#pos").data("k", newbanker)
                $("#pos").data("id", pos[newbanker])
                $("#count").val(0)
            }
            $("#show tbody").prepend(`<tr><td>${index++}</td><td>${scor.E}</td><td>${scor.S}</td><td>${scor.W}</td><td>${scor.N}</td></tr>`)

        })
    }

    $("#setpoint").on("click", () => {
        $("#set input").prop("readonly", true)
        $(`#show`).toggleClass("d-none")
        $(`#setpoint`).toggleClass("d-none")
    })
