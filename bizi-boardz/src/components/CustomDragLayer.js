import { useDragLayer } from 'react-dnd'
import TaskCard from './TaskCard'

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '25%',
    height: '100%'
};

function getItemStyles(initialOffset, currentOffset) {
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        }
    }

    let { x, y } = currentOffset

    const transform = `translate(${x}px, ${y}px)`
    return {
        transform,
        WebkitTransform: transform,
    }
}

export const CustomDragLayer = (props) => {
    const { itemType, isDragging, item, initialOffset, currentOffset } =
        useDragLayer((monitor) => ({
            item: monitor.getItem(),
            itemType: monitor.getItemType(),
            initialOffset: monitor.getInitialSourceClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            isDragging: monitor.isDragging(),
        }))
    if (!isDragging) {
        return null
    }
    return (
        <div style={layerStyles}>
            <div style={getItemStyles(initialOffset, currentOffset)}>
                {/* Dummy task card rendered when dragging */}
                <TaskCard
                    taskName={item.taskName}
                    taskLength={item.taskLength}
                    assignee={item.assignee}
                    priority={item.priority}
                    description={item.description}
                    currentProgress={item.currentProgress}
                    sprintStatus={item.sprint}
                />
            </div>
        </div>
    )
}