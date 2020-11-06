$(document).ready(function () {
  // Focus on the newItem input on page load
  $(".newItem").focus();

  // Add active on sidebar link that has the same href as url pathname
  const path = window.location.pathname;
  $("a[href='" + path + "']")
    .parent()
    .addClass("active");

  // Hide sidebar
  $("#dismiss, .overlay").on("click", function () {
    // hide sidebar
    $("#sidebar").removeClass("active");
    // hide overlay
    $(".overlay").removeClass("active");
  });

  // Open sidebar
  $("#sidebarBtn").on("click", function () {
    // open sidebar
    $("#sidebar").addClass("active");
    // fade in the overlay
    $(".overlay").addClass("active");
    $(".collapse.in").toggleClass("in");
    $("a[aria-expanded=true]").attr("aria-expanded", "false");
  });

  // On mobile, hide sidebar after new list link is clicked
  $("#addNewListLink").on("click", function () {
    // hide sidebar
    $("#sidebar").removeClass("active");
    // hide overlay
    $(".overlay").removeClass("active");
  });

  // If list title already exists
  if ($(".errorMsg").text() != "") {
    $("#errorModal").modal("show");
  }

  // Show close icon on item hover
  $(".item").hover(
    function () {
      $(this).find(".close").show();
    },
    function () {
      $(this).find(".close").hide();
    }
  );

  // Show close icon on list title hover
  $(".listLink").hover(
    function () {
      $(this).find(".deleteList").show();
    },
    function () {
      $(this).find(".deleteList").hide();
    }
  );

  // If on mobile, unbind hover
  if ($(".mobileOn").css("display") != "none") {
    $(".item").unbind();
    $(".listLink").unbind();
    if ($(".overlay.active").length > 0) {
      $("#content").css("margin-right", "-250px");
    }
  }

  // Delete list on close icon click
  $(".deleteList").click(function () {
    // hide sidebar
    $("#sidebar").removeClass("active");
    // hide overlay
    $(".overlay").removeClass("active");
    let toDelete = $(this).siblings(".listID").val();
    let title = $(this).siblings(".titleOfList").text();
    $(".listToDelete").attr("value", toDelete);
    $("#titleToDelete").text(title);
    $("#confirmDelete").modal("show");
  });

  // On input change
  $("input").change(function () {
    let inputArea = $(this).attr("class");
    itemID = $(this).siblings(".itemID").val();
    listID = $(this).siblings(".listID").val();
    content = $(this).val();

    switch (inputArea) {
      // Update list Title
      case "listTitleInput":
        $(this).parent().submit();
        break;

      // Update items in toDo
      case "toDo":
        $.ajax({
          dataType: "text",
          method: "post",
          url: "/editToDo",
          data: {
            itemID: itemID,
            listID: listID,
            toDoContent: content,
          },
        });
        break;

      // Update items in done
      case "done":
        $.ajax({
          dataType: "text",
          method: "post",
          url: "/editDone",
          data: {
            doneID: itemID,
            doneListID: listID,
            doneContent: content,
          },
        });
        break;

      // Move from toDo to done
      case "toDoCheckbox":
        $(this).prop("checked", true);
        content = $(this).siblings(".toDo").val();
        $.ajax({
          dataType: "text",
          method: "post",
          url: "/done",
          data: {
            itemID: itemID,
            listID: listID,
            toDoContent: content,
          },
          success: function () {
            $(".item" + itemID).insertBefore(".space");
            $(".item" + itemID)
              .children(".toDoCheckbox")
              .addClass("doneCheckbox")
              .removeClass("toDoCheckbox");
            $(".item" + itemID)
              .children(".toDo")
              .addClass("done")
              .removeClass("toDo");
            $(".item" + itemID)
              .children(".deleteFrom")
              .attr("value", "done");
            $(".item" + itemID)
              .addClass("doneItem" + itemID)
              .removeClass("item" + itemID);
          },
        });
        break;

      // Move from done to toDo
      case "doneCheckbox":
        $(this).prop("checked", false);
        content = $(this).siblings(".done").val();
        $.ajax({
          dataType: "text",
          method: "post",
          url: "/toDoAgain",
          data: {
            doneID: itemID,
            doneListID: listID,
            doneContent: content,
          },
          success: function () {
            $(".doneItem" + itemID).insertBefore(".addNewItem");
            $(".doneItem" + itemID)
              .children(".doneCheckbox")
              .addClass("toDoCheckbox")
              .removeClass("doneCheckbox");
            $(".doneItem" + itemID)
              .children(".done")
              .addClass("toDo")
              .removeClass("done");
            $(".doneItem" + itemID)
              .children(".deleteFrom")
              .attr("value", "toDo");
            $(".doneItem" + itemID)
              .addClass("item" + itemID)
              .removeClass("doneItem" + itemID);
          },
        });
        break;

      case "newItem":
        $.ajax({
          dataType: "text",
          method: "post",
          url: "/addItem",
          data: {
            newItem: content,
            listID: listID,
          },
          success: function (data) {
            newItemID = JSON.parse(data);
            $(".template")
              .clone(true)
              .insertBefore(".addNewItem")
              .addClass("item" + newItemID)
              .removeClass("template");
            $(".item" + newItemID)
              .children(".toDo")
              .attr("value", content);
            $(".item" + newItemID)
              .children(".itemID")
              .attr("value", newItemID);
            $(".item" + newItemID)
              .children(".listID")
              .attr("value", listID);
            $(".newItem").val("");
          },
        });
        break;

      // Create new list
      case "form-control myModalInput":
        $(this).parent().parent().submit();
        break;
    }
  });

  // On item delete
  $("button[type='button']").click(function () {
    let deleteID = $(this).siblings(".itemID").val();
    let deleteListID = $(this).siblings(".listID").val();
    let deleteFrom = $(this).val();

    $.ajax({
      dataType: "text",
      method: "post",
      url: "/delete",
      data: {
        deleteID: deleteID,
        deleteListID: deleteListID,
        deleteFrom: deleteFrom,
      },
      success: function () {
        if (deleteFrom === "toDo") {
          $(".item" + deleteID).remove();
        } else {
          $(".doneItem" + deleteID).remove();
        }
      },
    });
  });

  // On add new list modal show, focus on input
  $("#newListTitleModal").on("shown.bs.modal", function () {
    $("#newTitleInput").focus();
  });
});
