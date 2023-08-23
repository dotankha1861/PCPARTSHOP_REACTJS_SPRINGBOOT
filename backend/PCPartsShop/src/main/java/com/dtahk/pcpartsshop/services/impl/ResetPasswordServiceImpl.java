package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.commons.RespBody;
import com.dtahk.pcpartsshop.config.mail.MailSenderProvider;
import com.dtahk.pcpartsshop.dtos.MailBag;
import com.dtahk.pcpartsshop.dtos.PasswordResetDto;
import com.dtahk.pcpartsshop.dtos.ValidateTokenDto;
import com.dtahk.pcpartsshop.entites.PasswordResetToken;
import com.dtahk.pcpartsshop.entites.User;
import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.repositories.ResetPasswordRepository;
import com.dtahk.pcpartsshop.services.ResetPasswordService;
import com.dtahk.pcpartsshop.services.UserService;
import com.dtahk.pcpartsshop.utils.UploadFileUtil;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ResetPasswordServiceImpl implements ResetPasswordService {
    public static final String CAN_NOT_SENT_EMAIL = "Lỗi không thể gửi mail";
    public static final String PATH = "http://localhost:3000/reset-password/";
    public static final String TOKEN_NOT_EXIST = "Token không tồn tại";
    public static final String TOKEN_HAS_EXPIRED = "Token đã hết hạn";
    private final UserService userService;
    private final MailSenderProvider mailSenderProvider;
    private final ResetPasswordRepository resetPasswordRepository;
    private static final String SUBJECT = "PCPARTSSHOP - GỬI LINK CẬP NHẬT LẠI MẬT KHẨU";
    private static final String CONTENT_PRE = "<html><body><p>Xin chào bạn! </p>"
            + "<p>Bạn đã yêu cầu nhân link cập nhật lại mật khẩu?</p>"
            + "<p>Bạn có thể sử dụng url này để cập nhật lại mật khẩu.</p>"
            + "<p><a href=\"";
    private static final String CONTENT_POST = "\">Click vào đây</a></p>"
            + "<br>"
            + "<p>Nếu bạn không muốn cập nhật lại mật khẩu vui lòng bỏ qua email này"
            + "</p>"
            + "<p>Xin cảm ơn,</p>"
            + "<p>... .</p></body></html>";
    private static final int VALID_MINUTES = 15;

    @Override
    @Transactional
    public void sendResetPasswordToken(String email) {
        User user = userService.getUserByEmail(email);
        String token = UUID.randomUUID().toString();

        PasswordResetToken saveResetPWToken = new PasswordResetToken();
        saveResetPWToken.setToken(token);
        saveResetPWToken.setUser(user);
        saveResetPWToken.setExpiryTime(LocalDateTime.now().plusMinutes(VALID_MINUTES));

        Optional<PasswordResetToken> passwordResetToken = resetPasswordRepository.findByUserId(user.getId());
        passwordResetToken.ifPresent(resetToken -> saveResetPWToken.setId(passwordResetToken.get().getId()));
        resetPasswordRepository.save(saveResetPWToken);

        MailBag mailBag = new MailBag();
        mailBag.setTo(user.getEmail());
        mailBag.setContent(CONTENT_PRE + PATH + token + CONTENT_POST);
        mailBag.setSubject(SUBJECT);
        try {
            mailSenderProvider.sendEmail(mailBag);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new AppException(CAN_NOT_SENT_EMAIL, HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    public void validateToken(ValidateTokenDto validateTokenDto) {
        PasswordResetToken passwordResetToken = resetPasswordRepository.findByToken(validateTokenDto.getToken())
                .orElseThrow(() -> {
                    throw new AppException(TOKEN_NOT_EXIST, HttpStatus.NOT_FOUND);
                });
        if(passwordResetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new AppException(TOKEN_HAS_EXPIRED, HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    @Transactional
    public void resetPassword(PasswordResetDto passwordResetDto) {
        PasswordResetToken passwordResetToken = resetPasswordRepository.findByToken(passwordResetDto.getToken())
                .orElseThrow(() -> {
                    throw new AppException(TOKEN_NOT_EXIST, HttpStatus.NOT_FOUND);
                });
        if(passwordResetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new AppException(TOKEN_HAS_EXPIRED, HttpStatus.EXPECTATION_FAILED);
        }
        User user = passwordResetToken.getUser();
        userService.resetPassword(user, passwordResetDto.getNewPassword());
        resetPasswordRepository.delete(passwordResetToken);
    }


}
