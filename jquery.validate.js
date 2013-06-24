(function ( $ ) {
    $.fn.validate = function( options ) {
        var msg = "";
        // Set html 5 default messages null 
        $(this).attr('novalidate', 'novalidate');
        var data;
        var settings = $.extend({
            id: "",
            msg: "This field is required.",
        }, options );

        var call_custom = false;
        if(options == undefined){
           msg = settings.msg; 
        }else{
            call_custom = true;
        }
        var form = this;
        $(this).find('input,textarea,.mceIframeContainer').each(function(){
            inpt_type = $(this).attr('type');
            if(inpt_type!="submit"){
                $(this).keyup(function(){
                    data= this;
                    valid(data,call_custom,options);
                });
            }
        });

        $(this).find(':input[type=submit]').bind('click',function(event){
            tiny_mce = false;
            label = "<div class='error-message'>"+msg+"</div>";
            prev = false;
            $(form).find(':input[type=password],:input[type=text],:input[type=url],:input[type=email],textarea').each(function(i){
              if($(this).hasClass('required')){  
               if($(this).next().hasClass('mceEditor'))
                {
                    tiny_mce =true;
                    id  = $(this).attr('id');
                    if(tinymce.get(id).getContent() == ""){
                        if(!$(this).next().next().hasClass('error-message')){
                            //$(this).next().css('border','1px solid red');
                            $(label).insertAfter($(this).next());
                        }
                        prev = true;
                    }else {
                        if($(this).next().next().hasClass('error-message')){
                            $(this).next().next().remove();
                            $(this).next().css('border','none');
                        }   
                    }
                } else if($(this).val() == "" && !tiny_mce){
                    if(!$(this).next().hasClass('error-message')){
                            $(this).css('border','1px solid red');
                            if(call_custom){
                                msg = custom_msg(options,$(this).attr('id'));
                                label = "<div class='error-message'>"+msg+"</div>";
                                $(label).insertAfter($(this));
                            }else{
                                $(label).insertAfter($(this));   
                            }
                        }
                    prev = true;    
                } else {
                    if($(this).hasClass('frm_email')){
                        value = $(this).val();
                        if(!val_email(value)){
                            if(!$(this).next().hasClass('error-message')){
                                $("<div class='error-message'>Please enter a validate email address.</div>").insertAfter($(this));
                                $(this).css('border','1px solid red');
                            }
                            prev = true;
                        }
                    } else if($(this).hasClass('frm_phone')){
                        value = $(this).val();
                        if(!val_phone(value)){
                            if(!$(this).next().hasClass('error-message')){
                                $("<div class='error-message'>Please enter a valid phone number.</div>").insertAfter($(this));
                                $(this).css('border','1px solid red');
                            }
                            prev = true;
                        }
                    } else if ($(this).hasClass('frm_name')){
                        value = $(this).val();
                        if(!name_nws(value)){
                            if(!$(this).next().hasClass('error-message')){
                                $("<div class='error-message'>Please enter a valid name.</div>").insertAfter($(this));
                                $(this).css('border','1px solid red');
                            }
                            prev = true;
                        }
                    }else if ($(this).hasClass('frm_num')){
                        value = $(this).val();
                        if(!just_num(value)){
                            if(!$(this).next().hasClass('error-message')){
                                $("<div class='error-message'>Please enter a number.</div>").insertAfter($(this));
                                $(this).css('border','1px solid red');
                            }
                            prev = true;
                        }
                    } else if($(this).hasClass('frm_url')){
                        value = $(this).val();
                        if(!url_val(value)){
                            if(!$(this).next().hasClass('error-message')){
                                $("<div class='error-message'>Please enter a valid website address.</div>").insertAfter($(this));
                                $(this).css('border','1px solid red');
                            }
                            prev = true;
                        }
                    } else {
                        if(tiny_mce){
                           if($(this).next().hasClass('error-message')){
                            $(this).next().remove();
                            $(this).css('border','1px solid #B5B5B5');
                            } 
                        }
                    }
                }// else ends here
                }// if has class required
           
            });
            if(prev){
                event.preventDefault();
            }
             $(form).find('.select-class').each(function(){
                valid_select(this);
                $(this).bind('change',function(){
                   valid_select(this);
               });
            });
        });
    };
 
}( jQuery ));

function valid_select(data){
    if($(data).prev().is(':visible')){
      val = $(data).prev().find('.dk_label').text();
      if(val.indexOf('select') >  0){
          if(!$(data).next().hasClass('error-message')){
            $("<div class='error-message'>This field is required.</div>").insertAfter($(data));
            $(data).prev().find('.dk_label').parent().css('border','1px solid red');
          }
      }else{
        if($(data).next().hasClass('error-message')){
            $(data).next().remove();
            $(data).prev().find('.dk_label').parent().css('border','1px solid #B5B5B5');
          }
      }
   }
}
function valid(data,call_custom,options){
    if(call_custom){
        msg = custom_msg(options,$(this).attr('id'));
    }else{
        msg = "This field is required.";
    }
    label = "<div class='error-message'>"+msg+"</div>";
    type = $(data).is('textarea');
    if( type != 'hidden'){
       if($(data).hasClass('required')){
            if($(data).val() == ""){
                if(type){
                    if(!$(data).next().hasClass('error-message')){
                        $(label).insertAfter($(data));
                    } 
                }else{
                    if(!$(data).next().hasClass('error-message')){
                        $(label).insertAfter(data);
                    }
                }   
                $(data).css('border','1px solid red');
            }else {
                if($(data).next().hasClass('error-message')){
                    $(data).next().remove();
                    $(data).css('border','1px solid #B5B5B5');
                }   
            }
        }
    }

}


function val_email(value){
   return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
}
//     /^((\+44?|0)(7|8|2|1)\d{3}?\d{6})$/;
function val_phone(value){
    return  /^((\+44?|0)(7|8|2|1)\d{3}?\d{6})$/.test(value);
}
function name_nws(value){
    return /^[a-zA-Z]+$/.test(value);
}
function name_ws(value){
    return /^[a-zA-Z ]+$/.test(value);
}
function just_num(value){
    return /^[0-9]+$/.test(value);
}
function url_val(value){
    return /^((http)(\:)(\/\/))?([a-z0-9_-]+\.)?[a-z0-9_-]+(\.[a-z]{2,6}){1,5}(\/[\w]+)*$/.test(value);
}
function custom_msg(options,ids){
    msg = "This field is required.";
    $(options.id).each(function(i){
        if(options.id[i] == ids){
           msg = options.msg[i]; 
        }
    });
    return msg;
}