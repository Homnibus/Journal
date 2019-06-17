// AjaxQ jQuery Plugin
// Copyright (c) 2012 Foliotek Inc.
// MIT License
// https://github.com/Foliotek/ajaxq

(function ($) {

  const queues = {};
  const activeReqs = {};

  // Register an $.ajaxq function, which follows the $.ajax interface, but allows a queue name which will force only one request per queue to fire.
  $.ajaxq = function (qname, opts) {

    if (typeof opts === "undefined") {
      throw ("AjaxQ: queue name is not provided");
    }

    // Will return a Deferred promise object extended with success/error/callback, so that this function matches the interface of $.ajax
    const deferred = $.Deferred(),
      promise = deferred.promise();

    promise.success = promise.done;
    promise.error = promise.fail;
    promise.complete = promise.always;

    // Create a deep copy of the arguments, and enqueue this request.
    const clonedOptions = $.extend(true, {}, opts);
    enqueue(function () {
      // Send off the ajax request now that the item has been removed from the queue
      const jqXHR = $.ajax.apply(window, [clonedOptions]);

      // Notify the returned deferred object with the correct context when the jqXHR is done or fails
      // Note that 'always' will automatically be fired once one of these are called: http://api.jquery.com/category/deferred-object/.
      jqXHR.done(function () {
        deferred.resolve.apply(this, arguments);
      });
      jqXHR.fail(function () {
        deferred.reject.apply(this, arguments);
      });

      jqXHR.always(dequeue); // make sure to dequeue the next request AFTER the done and fail callbacks are fired
      return jqXHR;
    });

    return promise;


    // If there is no queue, create an empty one and instantly process this item.
    // Otherwise, just add this item onto it for later processing.
    function enqueue(cb) {
      if (!queues[qname]) {
        queues[qname] = [];
        const xhr = cb();
        activeReqs[qname] = xhr;
      } else {
        queues[qname].push(cb);
      }
    }

    // Remove the next callback from the queue and fire it off.
    // If the queue was empty (this was the last item), delete it from memory so the next one can be instantly processed.
    function dequeue() {
      if (!queues[qname]) {
        return;
      }
      const nextCallback = queues[qname].shift();
      if (nextCallback) {
        const xhr = nextCallback();
        activeReqs[qname] = xhr;
      } else {
        delete queues[qname];
        delete activeReqs[qname];
      }
    }
  };

  // Register a $.postq and $.getq method to provide shortcuts for $.get and $.post
  // Copied from jQuery source to make sure the functions share the same defaults as $.get and $.post.
  $.each(["getq", "postq"], function (i, method) {
    $[method] = function (qname, url, data, callback, type) {

      if ($.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = undefined;
      }

      return $.ajaxq(qname, {
        type: method === "postq" ? "post" : "get",
        url: url,
        data: data,
        success: callback,
        dataType: type
      });
    };
  });

  const isQueueRunning = function (qname) {
    return queues.hasOwnProperty(qname);
  };

  const isAnyQueueRunning = function () {
    for (let i in queues) {
      if (isQueueRunning(i)) return true;
    }
    return false;
  };

  const getQueueLength = function (qname) {
    if (!queues.hasOwnProperty(qname)) {
      return 0;
    } else {
      return queues[qname].length + 1;
    }
  };

  const getAllQueueLength = function () {
    let totalLength = 0;
    for (let i in queues) {
      totalLength += getQueueLength(i);
    }
    return totalLength;
  };


  $.ajaxq.queueLength = function (qname) {
    if (qname) return getQueueLength(qname);
    else return getAllQueueLength();
  };

  $.ajaxq.allQueueLength = function (qname) {
    return getQueueLength(qname);
  };

  $.ajaxq.isRunning = function (qname) {
    if (qname) return isQueueRunning(qname);
    else return isAnyQueueRunning();
  };

  $.ajaxq.getActiveRequest = function (qname) {
    if (!qname) throw ("AjaxQ: queue name is required");

    return activeReqs[qname];
  };

  $.ajaxq.abort = function (qname) {
    if (!qname) throw ("AjaxQ: queue name is required");

    const current = $.ajaxq.getActiveRequest(qname);
    delete queues[qname];
    delete activeReqs[qname];
    if (current) current.abort();
  };

  $.ajaxq.clear = function (qname) {
    if (!qname) {
      for (let i in queues) {
        if (queues.hasOwnProperty(i)) {
          queues[i] = [];
        }
      }
    } else {
      if (queues[qname]) {
        queues[qname] = [];
      }
    }
  };

})(jQuery);
