package com.cinema.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.cinema.entity.Combo;
import com.cinema.entity.Coupon;
import com.cinema.entity.Genre;
import com.cinema.entity.Movie;
import com.cinema.entity.Room;
import com.cinema.entity.Seat;
import com.cinema.entity.SeatType;
import com.cinema.entity.Showtime;
import com.cinema.entity.User;
import com.cinema.enums.AgeRating;
import com.cinema.enums.DiscountType;
import com.cinema.enums.EntityStatus;
import com.cinema.enums.Role;
import com.cinema.repository.ComboRepository;
import com.cinema.repository.CouponRepository;
import com.cinema.repository.GenreRepository;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.RoomRepository;
import com.cinema.repository.SeatRepository;
import com.cinema.repository.SeatTypeRepository;
import com.cinema.repository.ShowtimeRepository;
import com.cinema.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SeatTypeRepository seatTypeRepository;
    private final GenreRepository genreRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;
    private final ShowtimeRepository showtimeRepository;
    private final ComboRepository comboRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // Users
        userRepository.save(User.builder()
                .userId(UUID.fromString("00000000-0000-0000-0000-000000000001"))
                .fullName("System Admin")
                .email("admin@cinema.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .status(EntityStatus.ACTIVE)
                .build());

        userRepository.save(User.builder()
                .userId(UUID.fromString("00000000-0000-0000-0000-000000000002"))
                .fullName("Nguyen Van A")
                .email("customer@test.com")
                .passwordHash(passwordEncoder.encode("customer123"))
                .role(Role.CUSTOMER)
                .status(EntityStatus.ACTIVE)
                .phone("0901234567")
                .build());

        // Seat types
        SeatType standard = seatTypeRepository.save(SeatType.builder()
                .seatTypeId(UUID.fromString("a0000001-0000-0000-0000-000000000001"))
                .typeName("Standard")
                .priceMultiplier(new BigDecimal("1.00"))
                .colorHex("#4CAF50")
                .build());

        SeatType vip = seatTypeRepository.save(SeatType.builder()
                .seatTypeId(UUID.fromString("a0000001-0000-0000-0000-000000000002"))
                .typeName("VIP")
                .priceMultiplier(new BigDecimal("1.50"))
                .colorHex("#FF9800")
                .build());

        seatTypeRepository.save(SeatType.builder()
                .seatTypeId(UUID.fromString("a0000001-0000-0000-0000-000000000003"))
                .typeName("Couple")
                .priceMultiplier(new BigDecimal("2.00"))
                .colorHex("#E91E63")
                .build());

        // Genres
        Genre hanhDong = genreRepository.save(Genre.builder()
                .genreId(UUID.fromString("b0000001-0000-0000-0000-000000000001"))
                .name("Hanh dong").slug("hanh-dong").build());
        Genre haiHuoc = genreRepository.save(Genre.builder()
                .genreId(UUID.fromString("b0000001-0000-0000-0000-000000000002"))
                .name("Hai huoc").slug("hai-huoc").build());
        Genre kinhDi = genreRepository.save(Genre.builder()
                .genreId(UUID.fromString("b0000001-0000-0000-0000-000000000004"))
                .name("Kinh di").slug("kinh-di").build());
        Genre khvt = genreRepository.save(Genre.builder()
                .genreId(UUID.fromString("b0000001-0000-0000-0000-000000000005"))
                .name("Khoa hoc vien tuong").slug("khoa-hoc-vien-tuong").build());
        Genre hoatHinh = genreRepository.save(Genre.builder()
                .genreId(UUID.fromString("b0000001-0000-0000-0000-000000000006"))
                .name("Hoat hinh").slug("hoat-hinh").build());
        genreRepository.save(Genre.builder()
                .genreId(UUID.fromString("b0000001-0000-0000-0000-000000000003"))
                .name("Tinh cam").slug("tinh-cam").build());

        // Movies
        Movie movie1 = saveMovieWithGenres(Movie.builder()
                .movieId(UUID.fromString("c0000001-0000-0000-0000-000000000001"))
                .title("Avengers: Endgame")
                .description("Biet doi sieu anh hung tap hop lan cuoi chong lai Than Rung")
                .duration(181)
                .language("Tieng Anh")
                .director("Anthony Russo, Joe Russo")
                .actors("Robert Downey Jr., Chris Evans, Scarlett Johansson")
                .ageRating(AgeRating.T13)
                .trailerUrl("https://www.youtube.com/watch?v=TcMBFSGVi1c")
                .posterUrl("https://picsum.photos/seed/avengers/300/450")
                .showingStartDate(LocalDate.of(2026, 6, 1))
                .showingEndDate(LocalDate.of(2026, 7, 15))
                .status(EntityStatus.ACTIVE)
                .build(), hanhDong, khvt);

        Movie movie2 = saveMovieWithGenres(Movie.builder()
                .movieId(UUID.fromString("c0000001-0000-0000-0000-000000000002"))
                .title("Doraemon: Nobita va ban nhac sieu pham")
                .description("Chuyen phieu luu am nhac cua Nobita va nhung nguoi ban")
                .duration(115)
                .language("Tieng Viet")
                .director("Yukiyo Teramoto")
                .actors("Wasabi Mizuta, Megumi Ohara")
                .ageRating(AgeRating.P)
                .posterUrl("https://picsum.photos/seed/doraemon/300/450")
                .showingStartDate(LocalDate.of(2026, 6, 5))
                .showingEndDate(LocalDate.of(2026, 7, 20))
                .status(EntityStatus.ACTIVE)
                .build(), hoatHinh, haiHuoc);

        Movie movie3 = saveMovieWithGenres(Movie.builder()
                .movieId(UUID.fromString("c0000001-0000-0000-0000-000000000003"))
                .title("Inception (Ke danh cap giac mo)")
                .description("Mot ke trom gioi thuc hien phien vu danh cap bi mat tu trong giac mo")
                .duration(148)
                .language("Tieng Anh")
                .director("Christopher Nolan")
                .actors("Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page")
                .ageRating(AgeRating.T13)
                .trailerUrl("https://www.youtube.com/watch?v=YoHD9XEInc0")
                .posterUrl("https://picsum.photos/seed/inception/300/450")
                .showingStartDate(LocalDate.of(2026, 6, 10))
                .showingEndDate(LocalDate.of(2026, 7, 25))
                .status(EntityStatus.ACTIVE)
                .build(), hanhDong, khvt);

        Movie movie4 = saveMovieWithGenres(Movie.builder()
                .movieId(UUID.fromString("c0000001-0000-0000-0000-000000000004"))
                .title("Am anh kinh hoang (The Conjuring)")
                .description("Cap vo chong chuyen gia dieu tra nhung vu viec sieu nhien ghe ron")
                .duration(112)
                .language("Tieng Anh")
                .director("James Wan")
                .actors("Vera Farmiga, Patrick Wilson, Lili Taylor")
                .ageRating(AgeRating.T18)
                .trailerUrl("https://www.youtube.com/watch?v=k10ETZ41q5o")
                .posterUrl("https://picsum.photos/seed/conjuring/300/450")
                .showingStartDate(LocalDate.of(2026, 6, 12))
                .showingEndDate(LocalDate.of(2026, 7, 30))
                .status(EntityStatus.ACTIVE)
                .build(), kinhDi);

        Movie movie5 = saveMovieWithGenres(Movie.builder()
                .movieId(UUID.fromString("c0000001-0000-0000-0000-000000000005"))
                .title("Titanic")
                .description("Moi tinh lang man tren con tau dinh menh Titanic")
                .duration(194)
                .language("Tieng Anh")
                .director("James Cameron")
                .actors("Leonardo DiCaprio, Kate Winslet, Billy Zane")
                .ageRating(AgeRating.T13)
                .trailerUrl("https://www.youtube.com/watch?v=2e-eXJ6HgkQ")
                .posterUrl("https://picsum.photos/seed/titanic/300/450")
                .showingStartDate(LocalDate.of(2026, 6, 15))
                .showingEndDate(LocalDate.of(2026, 7, 31))
                .status(EntityStatus.ACTIVE)
                .build(), haiHuoc);

        Movie movie6 = saveMovieWithGenres(Movie.builder()
                .movieId(UUID.fromString("c0000001-0000-0000-0000-000000000006"))
                .title("Deadpool")
                .description("Anh hung phan dien hinh hai huoc voi kha nang bat tu")
                .duration(108)
                .language("Tieng Anh")
                .director("Tim Miller")
                .actors("Ryan Reynolds, Morena Baccarin, T.J. Miller")
                .ageRating(AgeRating.T18)
                .trailerUrl("https://www.youtube.com/watch?v=ONHBaC-pfsk")
                .posterUrl("https://picsum.photos/seed/deadpool/300/450")
                .showingStartDate(LocalDate.of(2026, 6, 18))
                .showingEndDate(LocalDate.of(2026, 8, 5))
                .status(EntityStatus.ACTIVE)
                .build(), hanhDong, haiHuoc);

        Movie movie7 = saveMovieWithGenres(Movie.builder()
                .movieId(UUID.fromString("c0000001-0000-0000-0000-000000000007"))
                .title("Nguoi Nhen: Khong con nha")
                .description("Peter Parker doi mat voi da vu tru khi danh tinh bi lo")
                .duration(148)
                .language("Tieng Anh")
                .director("Jon Watts")
                .actors("Tom Holland, Zendaya, Benedict Cumberbatch")
                .ageRating(AgeRating.T13)
                .trailerUrl("https://www.youtube.com/watch?v=JfVOs4VSpmA")
                .posterUrl("https://picsum.photos/seed/spiderman/300/450")
                .showingStartDate(LocalDate.of(2026, 6, 20))
                .showingEndDate(LocalDate.of(2026, 8, 10))
                .status(EntityStatus.ACTIVE)
                .build(), hanhDong, khvt);

        Movie movie8 = saveMovieWithGenres(Movie.builder()
                .movieId(UUID.fromString("c0000001-0000-0000-0000-000000000008"))
                .title("Minions")
                .description("Nhung sinh vat mau vang sieu quay tim chu")
                .duration(90)
                .language("Tieng Anh")
                .director("Pierre Coffin, Kyle Balda")
                .actors("Pierre Coffin, Sandra Bullock")
                .ageRating(AgeRating.P)
                .trailerUrl("https://www.youtube.com/watch?v=eisKxhjBnZ0")
                .posterUrl("https://picsum.photos/seed/minions/300/450")
                .showingStartDate(LocalDate.of(2026, 6, 22))
                .showingEndDate(LocalDate.of(2026, 8, 15))
                .status(EntityStatus.ACTIVE)
                .build(), hoatHinh, haiHuoc);

        Movie movie9 = saveMovieWithGenres(Movie.builder()
                .movieId(UUID.fromString("c0000001-0000-0000-0000-000000000009"))
                .title("Interstellar")
                .description("Hanh trinh xuyen khong gian tim hanh tinh moi cho nhan loai")
                .duration(169)
                .language("Tieng Anh")
                .director("Christopher Nolan")
                .actors("Matthew McConaughey, Anne Hathaway, Jessica Chastain")
                .ageRating(AgeRating.T13)
                .trailerUrl("https://www.youtube.com/watch?v=zSWdZVtXT7E")
                .posterUrl("https://picsum.photos/seed/interstellar/300/450")
                .showingStartDate(LocalDate.of(2026, 6, 25))
                .showingEndDate(LocalDate.of(2026, 8, 20))
                .status(EntityStatus.ACTIVE)
                .build(), khvt);

        Movie movie10 = saveMovieWithGenres(Movie.builder()
                .movieId(UUID.fromString("c0000001-0000-0000-0000-000000000010"))
                .title("Vong tron tu than (The Ring)")
                .description("Cuon bang video mang loi nguyen chet choc - 7 ngay de song sot")
                .duration(115)
                .language("Tieng Nhat")
                .director("Hideo Nakata")
                .actors("Naomi Watts, Martin Henderson, Brian Cox")
                .ageRating(AgeRating.T18)
                .trailerUrl("https://www.youtube.com/watch?v=HyWWNkCv0pY")
                .posterUrl("https://picsum.photos/seed/thering/300/450")
                .showingStartDate(LocalDate.of(2026, 7, 1))
                .showingEndDate(LocalDate.of(2026, 8, 25))
                .status(EntityStatus.ACTIVE)
                .build(), kinhDi);

        // Rooms
        Room room1 = roomRepository.save(Room.builder()
                .roomId(UUID.fromString("d0000001-0000-0000-0000-000000000001"))
                .roomName("Phong 1")
                .totalRows(5)
                .totalColumns(8)
                .aisleAfterColumns("4")
                .status(EntityStatus.ACTIVE)
                .build());

        Room room2 = roomRepository.save(Room.builder()
                .roomId(UUID.fromString("d0000001-0000-0000-0000-000000000002"))
                .roomName("Phong 2")
                .totalRows(6)
                .totalColumns(10)
                .aisleAfterColumns("4,9")
                .status(EntityStatus.ACTIVE)
                .build());

        // Seats for Room 1 (5 rows x 8 cols)
        String[] rows = {"A", "B", "C", "D", "E"};
        SeatType[] rowTypes = {standard, standard, vip, vip, vip};
        for (int r = 0; r < rows.length; r++) {
            for (int c = 1; c <= 8; c++) {
                seatRepository.save(Seat.builder()
                        .seatId(UUID.randomUUID())
                        .room(room1)
                        .seatType(rowTypes[r])
                        .rowLabel(rows[r])
                        .seatNumber(c)
                        .status(EntityStatus.ACTIVE)
                        .build());
            }
        }

        // Seats for Room 2 (6 rows x 10 cols)
        String[] rows2 = {"A", "B", "C", "D", "E", "F"};
        SeatType[] rowTypes2 = {standard, standard, standard, vip, vip, vip};
        for (int r = 0; r < rows2.length; r++) {
            for (int c = 1; c <= 10; c++) {
                seatRepository.save(Seat.builder()
                        .seatId(UUID.randomUUID())
                        .room(room2)
                        .seatType(rowTypes2[r])
                        .rowLabel(rows2[r])
                        .seatNumber(c)
                        .status(EntityStatus.ACTIVE)
                        .build());
            }
        }

        // Showtimes - Movie 1 (Avengers)
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000001"))
                .movie(movie1).room(room1)
                .startTime(LocalDateTime.of(2026, 6, 16, 9, 0))
                .endTime(LocalDateTime.of(2026, 6, 16, 12, 1))
                .basePrice(new BigDecimal("75000"))
                .status(EntityStatus.ACTIVE).build());
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000002"))
                .movie(movie1).room(room1)
                .startTime(LocalDateTime.of(2026, 6, 16, 13, 0))
                .endTime(LocalDateTime.of(2026, 6, 16, 16, 1))
                .basePrice(new BigDecimal("85000"))
                .status(EntityStatus.ACTIVE).build());
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000003"))
                .movie(movie1).room(room2)
                .startTime(LocalDateTime.of(2026, 6, 16, 15, 0))
                .endTime(LocalDateTime.of(2026, 6, 16, 18, 1))
                .basePrice(new BigDecimal("75000"))
                .status(EntityStatus.ACTIVE).build());

        // Showtimes - Movie 2 (Doraemon)
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000004"))
                .movie(movie2).room(room1)
                .startTime(LocalDateTime.of(2026, 6, 16, 10, 0))
                .endTime(LocalDateTime.of(2026, 6, 16, 11, 55))
                .basePrice(new BigDecimal("65000"))
                .status(EntityStatus.ACTIVE).build());
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000005"))
                .movie(movie2).room(room2)
                .startTime(LocalDateTime.of(2026, 6, 17, 8, 0))
                .endTime(LocalDateTime.of(2026, 6, 17, 9, 55))
                .basePrice(new BigDecimal("65000"))
                .status(EntityStatus.ACTIVE).build());
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000006"))
                .movie(movie2).room(room2)
                .startTime(LocalDateTime.of(2026, 6, 17, 14, 0))
                .endTime(LocalDateTime.of(2026, 6, 17, 15, 55))
                .basePrice(new BigDecimal("75000"))
                .status(EntityStatus.ACTIVE).build());

        // Showtimes - Movie 3 (Inception)
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000007"))
                .movie(movie3).room(room1)
                .startTime(LocalDateTime.of(2026, 6, 16, 17, 0))
                .endTime(LocalDateTime.of(2026, 6, 16, 19, 28))
                .basePrice(new BigDecimal("85000"))
                .status(EntityStatus.ACTIVE).build());
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000008"))
                .movie(movie3).room(room2)
                .startTime(LocalDateTime.of(2026, 6, 17, 10, 0))
                .endTime(LocalDateTime.of(2026, 6, 17, 12, 28))
                .basePrice(new BigDecimal("75000"))
                .status(EntityStatus.ACTIVE).build());

        // Showtimes - Movie 4 (Conjuring)
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000009"))
                .movie(movie4).room(room1)
                .startTime(LocalDateTime.of(2026, 6, 16, 20, 0))
                .endTime(LocalDateTime.of(2026, 6, 16, 21, 52))
                .basePrice(new BigDecimal("85000"))
                .status(EntityStatus.ACTIVE).build());
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000010"))
                .movie(movie4).room(room2)
                .startTime(LocalDateTime.of(2026, 6, 17, 20, 0))
                .endTime(LocalDateTime.of(2026, 6, 17, 21, 52))
                .basePrice(new BigDecimal("85000"))
                .status(EntityStatus.ACTIVE).build());

        // Showtimes - Movie 5 (Titanic)
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000011"))
                .movie(movie5).room(room1)
                .startTime(LocalDateTime.of(2026, 6, 17, 9, 0))
                .endTime(LocalDateTime.of(2026, 6, 17, 12, 14))
                .basePrice(new BigDecimal("85000"))
                .status(EntityStatus.ACTIVE).build());
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000012"))
                .movie(movie5).room(room2)
                .startTime(LocalDateTime.of(2026, 6, 18, 13, 0))
                .endTime(LocalDateTime.of(2026, 6, 18, 16, 14))
                .basePrice(new BigDecimal("85000"))
                .status(EntityStatus.ACTIVE).build());

        // Showtimes - Movie 6 (Deadpool)
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000013"))
                .movie(movie6).room(room1)
                .startTime(LocalDateTime.of(2026, 6, 16, 14, 0))
                .endTime(LocalDateTime.of(2026, 6, 16, 15, 48))
                .basePrice(new BigDecimal("75000"))
                .status(EntityStatus.ACTIVE).build());
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000014"))
                .movie(movie6).room(room2)
                .startTime(LocalDateTime.of(2026, 6, 18, 10, 0))
                .endTime(LocalDateTime.of(2026, 6, 18, 11, 48))
                .basePrice(new BigDecimal("75000"))
                .status(EntityStatus.ACTIVE).build());

        // Showtimes - Movie 7 (Spider-Man)
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000015"))
                .movie(movie7).room(room1)
                .startTime(LocalDateTime.of(2026, 6, 17, 11, 0))
                .endTime(LocalDateTime.of(2026, 6, 17, 13, 28))
                .basePrice(new BigDecimal("85000"))
                .status(EntityStatus.ACTIVE).build());
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000016"))
                .movie(movie7).room(room2)
                .startTime(LocalDateTime.of(2026, 6, 18, 17, 0))
                .endTime(LocalDateTime.of(2026, 6, 18, 19, 28))
                .basePrice(new BigDecimal("85000"))
                .status(EntityStatus.ACTIVE).build());

        // Showtimes - Movie 8 (Minions)
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000017"))
                .movie(movie8).room(room1)
                .startTime(LocalDateTime.of(2026, 6, 18, 8, 0))
                .endTime(LocalDateTime.of(2026, 6, 18, 9, 30))
                .basePrice(new BigDecimal("65000"))
                .status(EntityStatus.ACTIVE).build());
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000018"))
                .movie(movie8).room(room2)
                .startTime(LocalDateTime.of(2026, 6, 19, 8, 0))
                .endTime(LocalDateTime.of(2026, 6, 19, 9, 30))
                .basePrice(new BigDecimal("65000"))
                .status(EntityStatus.ACTIVE).build());

        // Showtimes - Movie 9 (Interstellar)
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000019"))
                .movie(movie9).room(room1)
                .startTime(LocalDateTime.of(2026, 6, 18, 20, 0))
                .endTime(LocalDateTime.of(2026, 6, 18, 22, 49))
                .basePrice(new BigDecimal("85000"))
                .status(EntityStatus.ACTIVE).build());
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000020"))
                .movie(movie9).room(room2)
                .startTime(LocalDateTime.of(2026, 6, 19, 14, 0))
                .endTime(LocalDateTime.of(2026, 6, 19, 16, 49))
                .basePrice(new BigDecimal("85000"))
                .status(EntityStatus.ACTIVE).build());

        // Showtimes - Movie 10 (The Ring)
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000021"))
                .movie(movie10).room(room1)
                .startTime(LocalDateTime.of(2026, 6, 19, 20, 0))
                .endTime(LocalDateTime.of(2026, 6, 19, 21, 55))
                .basePrice(new BigDecimal("85000"))
                .status(EntityStatus.ACTIVE).build());
        showtimeRepository.save(Showtime.builder()
                .showtimeId(UUID.fromString("e0000001-0000-0000-0000-000000000022"))
                .movie(movie10).room(room2)
                .startTime(LocalDateTime.of(2026, 6, 20, 20, 0))
                .endTime(LocalDateTime.of(2026, 6, 20, 21, 55))
                .basePrice(new BigDecimal("85000"))
                .status(EntityStatus.ACTIVE).build());

        // Combos
        comboRepository.save(Combo.builder()
                .comboId(UUID.fromString("f0000001-0000-0000-0000-000000000001"))
                .comboName("Combo Solo")
                .description("1 bap rang bo + 1 nuoc ngot")
                .price(new BigDecimal("55000"))
                .status(EntityStatus.ACTIVE).build());

        comboRepository.save(Combo.builder()
                .comboId(UUID.fromString("f0000001-0000-0000-0000-000000000002"))
                .comboName("Combo Doi")
                .description("2 bap rang bo + 2 nuoc ngot")
                .price(new BigDecimal("99000"))
                .status(EntityStatus.ACTIVE).build());

        comboRepository.save(Combo.builder()
                .comboId(UUID.fromString("f0000001-0000-0000-0000-000000000003"))
                .comboName("Combo Gia dinh")
                .description("3 bap rang bo + 3 nuoc ngot + 1 bong ngo")
                .price(new BigDecimal("149000"))
                .status(EntityStatus.ACTIVE).build());

        // Coupons
        couponRepository.save(Coupon.builder()
                .couponId(UUID.fromString("00000000-0000-0000-0000-000000000011"))
                .code("WELCOME10")
                .discountType(DiscountType.PERCENTAGE)
                .discountValue(new BigDecimal("10"))
                .quantity(100)
                .minOrderValue(BigDecimal.ZERO)
                .expiredAt(LocalDateTime.of(2026, 12, 31, 23, 59, 59))
                .status(EntityStatus.ACTIVE).build());

        couponRepository.save(Coupon.builder()
                .couponId(UUID.fromString("00000000-0000-0000-0000-000000000012"))
                .code("SAVE50K")
                .discountType(DiscountType.FIXED_AMOUNT)
                .discountValue(new BigDecimal("50000"))
                .quantity(50)
                .minOrderValue(new BigDecimal("200000"))
                .expiredAt(LocalDateTime.of(2026, 12, 31, 23, 59, 59))
                .status(EntityStatus.ACTIVE).build());
    }

    private Movie saveMovieWithGenres(Movie movie, Genre... genres) {
        movie = movieRepository.save(movie);
        for (Genre g : genres) {
            movie.getGenres().add(g);
        }
        return movieRepository.save(movie);
    }
}
