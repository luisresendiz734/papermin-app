import { useState } from "react";
import { useSales } from "../context/SalesContext";
import type { Sale } from "../context/SalesContext";
import { formatDistanceToNow } from "date-fns";
import generatePDF from "../components/TicketPDF";
import { useStore } from "../context/StoreContext";
import {
  Typography,
  Table,
  Paper,
  TableHead,
  TableBody,
  TableCell,
  makeStyles,
  TableRow,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Collapse,
  TableContainer,
} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import VentasChart from "../components/charts/VentasChart";
import ProductoChart from "../components/charts/ProductoChart";

const useStyles = makeStyles((theme) => ({
  subtitle: {
    marginLeft: theme.spacing(2),
  },
  card: {
    paddingTop: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  card2: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const Ventas = () => {
  const classes = useStyles();
  const { sales } = useSales();
  const [selected, setSelected] = useState<Sale | null>(null);
  const [openProducts, setOpenProducts] = useState(true);
  const store = useStore();

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Ventas
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.card}>
            <Typography variant="h6" className={classes.subtitle}>
              Historial de ventas
            </Typography>
            <VentasChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.card}>
            <Typography variant="h6" className={classes.subtitle}>
              Producto más vendido
            </Typography>
            <ProductoChart />
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={selected ? 8 : 12}>
          <Paper className={classes.card}>
            <Typography variant="h6" className={classes.subtitle}>
              Ultimas ventas
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="right">Productos</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales &&
                    sales
                      .sort((s, t) =>
                        new Date(s.createdAt.toDate()) >
                        new Date(t.createdAt.toDate())
                          ? 1
                          : 0
                      )
                      .map((sale, i) => (
                        <TableRow key={sale.id}>
                          <TableCell>v-00{i}</TableCell>
                          <TableCell>
                            {formatDistanceToNow(
                              new Date(sale.createdAt.toDate()),
                              {
                                addSuffix: true,
                                includeSeconds: true,
                              }
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {sale.products.length}
                          </TableCell>
                          <TableCell align="right">{`$${sale.total} MXN`}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              disableElevation
                              onClick={() => setSelected(sale)}
                            >
                              Ver
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        {selected && (
          <Grid item xs={12} md={4}>
            <Paper className={classes.card2}>
              <Typography variant="h6" className={classes.subtitle}>
                Desgloce de venta
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="ID" secondary={selected.id} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Fecha"
                    secondary={formatDistanceToNow(
                      new Date(selected.createdAt.toDate()),
                      {
                        addSuffix: true,
                        includeSeconds: true,
                      }
                    )}
                  />
                </ListItem>
                <ListItem onClick={() => setOpenProducts(!openProducts)} button>
                  <ListItemText primary="Productos" />
                  {openProducts ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openProducts} timeout="auto" unmountOnExit>
                  <List
                    component="div"
                    disablePadding
                    className={classes.nested}
                  >
                    {selected.products.map((product, i) => (
                      <ListItem key={i}>
                        <ListItemText
                          primary={product.name}
                          secondary={`$${product.price} MXN`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
                <ListItem>
                  <ListItemText
                    primary="Total"
                    secondary={`$${selected.total} MXN`}
                  />
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    color="primary"
                    disableElevation
                    onClick={() => generatePDF(selected, store, false)}
                  >
                    Descargar
                  </Button>
                </ListItem>
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Ventas;
