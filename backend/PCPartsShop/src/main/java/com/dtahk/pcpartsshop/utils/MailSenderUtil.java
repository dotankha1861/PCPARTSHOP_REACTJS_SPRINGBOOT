//package com.dtahk.pcpartsshop.utils;
//
//import jakarta.mail.MessagingException;
//import jakarta.mail.internet.MimeMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.JavaMailSenderImpl;
//import org.springframework.mail.javamail.MimeMessageHelper;
//
//import java.io.UnsupportedEncodingException;
//import java.util.Properties;
//
//public class MailSenderUtil {
//
//    private static void sendEmail(String link, String email)
//            throws UnsupportedEncodingException, MessagingException {
//        EmailSettingBag emailSettings = settingService.getEmailSettings();
//        JavaMailSender mailSender = prepareMailSender(emailSettings);
//
//        String subject = "Here's the link to reset your password";
//        String content = "<p>Hello,</p>"
//                + "<p>Did you forget your password?</p>"
//                + "<p>Alternately, you could use the url below to complete your action.</p>"
//                + "<p><a href=\"" + link + "\">Reset Password</a></p>"
//                + "<br>"
//                + "<p>If you don't want to change your password or didn't request this, "
//                + "please ignore and delete this message.</p>"
//                + "<p>Thank you,</p>"
//                + "<p>... .</p>";
//
//        MimeMessage message = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(message);
//
//        helper.setFrom(emailSettings.getFromAddress(), emailSettings.getSenderName());
//        helper.setTo(email);
//        helper.setSubject(subject);
//        helper.setText(content, true);
//
//        mailSender.send(message);
//    }
//
//}
