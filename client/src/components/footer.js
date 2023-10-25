import React from "react";
import FOOTCSS from "../components/footer.module.css";
import Logo from "../image/KK3.png";
import { Link } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

export const Footer = () => {
  const [open, setOpen] = React.useState(false);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className={FOOTCSS.footer}>
      <div className={FOOTCSS.KK}>
        <Link to="/" className={FOOTCSS.link}>
          <img src={Logo} alt="KitchenKonnect" className={FOOTCSS.logo} />
        </Link>
        <Link to="/" className={FOOTCSS.link} onClick={scrollToTop}>
          KitchenKonnect
        </Link>
      </div>

      <div className={FOOTCSS.aboutDiv}>
        <Link onClick={handleOpen} className={FOOTCSS.aboutLink}>
          About Us
        </Link>
      </div>

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={FOOTCSS.mdl}>
            <div className={FOOTCSS.about}>
              <h3>About Us!</h3>
              <p className={FOOTCSS.p}>
                Welcome to KitchenKonnect, your ultimate destination for
                discovering and sharing delicious recipes from around the world.
              </p>
              <p className={FOOTCSS.p}>
                We are passionate about bringing food enthusiasts together and
                helping them explore the joys of cooking and sharing meals.
              </p>
              <p className={FOOTCSS.p}>
                At KitchenKonnect, we believe that cooking is a creative and
                joyful experience that connects people across cultures.
              </p>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};
