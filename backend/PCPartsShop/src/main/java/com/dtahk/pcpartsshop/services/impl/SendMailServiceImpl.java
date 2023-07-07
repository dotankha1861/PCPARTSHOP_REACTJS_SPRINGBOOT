package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.services.SendMailService;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class SendMailServiceImpl implements SendMailService {
    private final JavaMailSender javaMailSender;

    public void sendEmail(){
        
    }
}
