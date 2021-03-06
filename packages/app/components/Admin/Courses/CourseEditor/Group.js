import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Grid,
  TextField,
  Switch,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControlLabel,
} from "@material-ui/core";
import { lesson, selectedLessonMetaProps } from "../../../../types";
import {
  BUTTON_SAVE,
  GROUP_SETTINGS_HEADER,
  LABEL_GROUP_NAME,
  GROUP_LESSONS_HEADER,
  BUTTON_NEW_LESSON_TEXT,
  BUTTON_DELETE_GROUP,
  GROUP_LESSON_ITEM_UNTITLED,
  ERROR_GROUP_NEW_LESSON_WITHOUT_SAVE,
  LABEL_GROUP_COLLAPSE,
} from "../../../../config/strings";
import { ExpandMore, Add } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";
import { setAppMessage } from "../../../../redux/actions";
import AppMessage from "../../../../models/app-message";

const styles = (theme) => ({
  lesson: {
    cursor: "pointer",
  },
  selected: {
    background: "#eee",
    borderRadius: 4,
    margin: theme.spacing(1),
  },
  section: {
    border: "1px solid #eee",
    background: "#f7f7f7",
    borderRadius: 4,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
});

const Group = ({
  lessons,
  group,
  onAddLesson,
  onRemoveGroup,
  updateGroup,
  onSelectLesson,
  selectedLesson,
  classes,
  dispatch,
}) => {
  const [name, setName] = useState(group.name);
  const [rank, setRank] = useState(group.rank);
  const [collapsed, setCollapsed] = useState(group.collapsed);

  useEffect(() => {
    setName(group.name);
    setRank(group.rank);
    setCollapsed(group.collapsed);
  }, [group]);

  const groupLessons = lessons.filter((lesson) => lesson.groupId === group.id);

  const isDirty =
    group.name !== name || group.rank !== rank || group.collapsed !== collapsed;

  const onSubmit = (e) => {
    e.preventDefault();

    updateGroup({ id: group.id, name, rank, collapsed });
  };

  const handleAddLesson = (groupId) => {
    if (!groupId) {
      return dispatch(
        setAppMessage(new AppMessage(ERROR_GROUP_NEW_LESSON_WITHOUT_SAVE))
      );
    }

    onAddLesson(groupId);
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="edit-lesson"
        id="edit-lesson"
      >
        <Typography variant="subtitle1">{name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="column">
          <Grid item className={classes.section}>
            <form onSubmit={onSubmit}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Grid container justify="space-between">
                    <Grid item>
                      <Typography variant="h6">
                        {GROUP_SETTINGS_HEADER}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button onClick={() => onRemoveGroup(group.id)}>
                        {BUTTON_DELETE_GROUP}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <TextField
                    variant="outlined"
                    label={LABEL_GROUP_NAME}
                    fullWidth
                    margin="normal"
                    name="title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Switch
                        type="checkbox"
                        name="collapsed"
                        checked={collapsed}
                        onChange={(e) => setCollapsed(e.target.checked)}
                      />
                    }
                    label={LABEL_GROUP_COLLAPSE}
                    labelPlacement="start"
                  />
                </Grid>
                <Grid item>
                  <Button type="submit" disabled={!isDirty || !name}>
                    {BUTTON_SAVE}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid item className={classes.section}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Typography variant="h6">{GROUP_LESSONS_HEADER}</Typography>
              </Grid>
              <Grid item>
                <Grid container direction="column" spacing={2}>
                  {groupLessons.map((item, index) => (
                    <>
                      {index === selectedLesson.index &&
                        group.id === selectedLesson.groupId && (
                          <Grid item className={classes.selected} key={index}>
                            {item.title && (
                              <Typography>{item.title}</Typography>
                            )}
                            {!item.title && (
                              <Typography>
                                {GROUP_LESSON_ITEM_UNTITLED}
                              </Typography>
                            )}
                          </Grid>
                        )}

                      {(index !== selectedLesson.index ||
                        group.id !== selectedLesson.groupId) && (
                        <Grid
                          item
                          className={classes.lesson}
                          onClick={() => onSelectLesson(group.id, index)}
                          key={index}
                        >
                          {item.title && <Typography>{item.title}</Typography>}
                          {!item.title && (
                            <Typography>
                              {GROUP_LESSON_ITEM_UNTITLED}
                            </Typography>
                          )}
                        </Grid>
                      )}
                    </>
                  ))}
                </Grid>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => handleAddLesson(group.id)}
                  startIcon={<Add />}
                >
                  {BUTTON_NEW_LESSON_TEXT}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

Group.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    rank: PropTypes.number,
    collapsed: PropTypes.bool,
  }),
  lessons: PropTypes.arrayOf(lesson),
  onAddLesson: PropTypes.func.isRequired,
  onRemoveGroup: PropTypes.func.isRequired,
  updateGroup: PropTypes.func.isRequired,
  onSelectLesson: PropTypes.func.isRequired,
  selectedLesson: selectedLessonMetaProps,
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
});

export default connect(
  () => ({}),
  mapDispatchToProps
)(withStyles(styles)(Group));
