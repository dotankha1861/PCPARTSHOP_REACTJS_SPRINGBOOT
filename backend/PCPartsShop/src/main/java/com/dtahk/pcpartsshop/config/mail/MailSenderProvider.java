package com.dtahk.pcpartsshop.config.mail;

import com.dtahk.pcpartsshop.dtos.MailBag;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;

@RequiredArgsConstructor
@Component
public class MailSenderProvider {
    public static final String PC_PARTS_SHOP = "PCPartsShop";
    @Value("spring.mail.username")
    private String from;
    private final JavaMailSender mailSender;
    public void sendEmail(MailBag mailBag) throws MessagingException, UnsupportedEncodingException {
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mailSender.createMimeMessage(), true, "UTF-8");
        mimeMessageHelper.setFrom(from, PC_PARTS_SHOP);
        mimeMessageHelper.setTo(mailBag.getTo());
        mimeMessageHelper.setSubject(mailBag.getSubject());
        mimeMessageHelper.setText(mailBag.getContent(), true);
        mailSender.send(mimeMessageHelper.getMimeMessage());
    }
}
