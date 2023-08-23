package com.dtahk.pcpartsshop;

import com.dtahk.pcpartsshop.config.mail.MailSenderProvider;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class PcPartsShopApplication  {

    public static void main(String[] args) {
        SpringApplication.run(PcPartsShopApplication.class, args);
    }

}
