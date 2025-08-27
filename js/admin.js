jQuery(document).ready(function($){
    var frame;

    // Open Media Library
    $('#sgl-select-images').click(function(e){
        e.preventDefault();
        if(frame) frame.open();
        else {
            frame = wp.media({
                title: 'Select Images',
                multiple: true,
                library: { type: 'image' },
                button: { text: 'Add to Gallery' }
            });

            frame.on('select', function(){
                var attachments = frame.state().get('selection').toJSON();
                attachments.forEach(function(att){
                    if($('#sgl-gallery-list div[data-id="'+att.id+'"]').length === 0){
                        $('#sgl-gallery-list').append(
                            '<div class="sgl-item-admin" data-id="'+att.id+'" style="margin:5px; text-align:center;">'+
                            '<img src="'+att.url+'" style="width:100px;height:100px;object-fit:cover;"><br>'+
                            '<button class="button sgl-remove-btn">Remove</button>'+
                            '</div>'
                        );
                    }
                });
            });
        }
        frame.open();
    });

    // Remove image
    $(document).on('click','.sgl-remove-btn', function(){
        $(this).closest('.sgl-item-admin').remove();
    });

    // Make sortable
    $('#sgl-gallery-list').sortable();

    // Save gallery
    $('#sgl-save-gallery').click(function(){
        var image_ids = [];
        $('#sgl-gallery-list .sgl-item-admin').each(function(){
            image_ids.push(parseInt($(this).data('id')));
        });

        $.post(sgl_ajax_obj.ajax_url, {
            action: 'sgl_save_gallery',
            nonce: sgl_ajax_obj.nonce,
            image_ids: image_ids
        }, function(res){
            if(res.success) alert('Gallery saved!');
            else alert(res.data || 'Error saving gallery.');
        });
    });
});
